
async function boardInit() {
    await init();
    await getTodosForBoard();
    updateBoard();
    initAddTask();
}

let todoId;
let clean;
let todo = [];


async function getTodosForBoard() {
    todo = JSON.parse(await getItem('tasks'));
    console.log(todo);
}


let currentDraggedElement;

function updateBoard() {
    let todos = todo.filter(t => t['category'] == 'todos');
    

    document.getElementById('task_content_open').innerHTML = '';

    for (let index = 0; index < todos.length; index++) {
        clean = todos[index];
        document.getElementById('task_content_open').innerHTML += generateTodo(clean);
    }
    let inprogress = todo.filter(t => t['category'] == 'inprogress');

    document.getElementById('close_one').innerHTML = '';

    for (let index = 0; index < inprogress.length; index++) {
        clean = inprogress[index];
        document.getElementById('close_one').innerHTML += generateTodo(clean);
    }
    let awaitList = todo.filter(t => t['category'] == 'await');

    document.getElementById('await_content').innerHTML = '';

    for (let index = 0; index < awaitList.length; index++) {
        clean = awaitList[index];
        document.getElementById('await_content').innerHTML += generateTodo(clean);
    }
    let doneList = todo.filter(t => t['category'] == 'done');

    document.getElementById('done_content').innerHTML = '';

    for (let index = 0; index < doneList.length; index++) {
        clean = doneList[index];
        document.getElementById('done_content').innerHTML += generateTodo(clean);
    }


}


function startDragging(todoId) {
    currentDraggedElement = todoId;
}


function generateTodo(clean) {
    let subtaskCount = 2;
    let progressWidth = (1 / subtaskCount) * 100;
    const todoId = `todo_${clean['id']}`;
    let descriptionWords = clean['description'].split(' ');
    let truncatedDescription = descriptionWords.slice(0, 5).join(' ');
    if (descriptionWords.length > 5) {
        truncatedDescription += '...';
    }

    let memberHtml = ''; // HTML für die Mitglieder

    // Durchlaufe die Mitglieder des aktuellen Todos und erstelle das HTML für jedes Mitglied
    for (let i = 0; i < clean.contacts.length; i++) {
        const member = clean.contacts[i];
        const { profileinitials, secondName } = getInitials(member);
        memberHtml += `
            <div class="circle letter-${secondName.toLowerCase()}">${profileinitials}</div>
        `;
    }

    return `<div draggable="true" ondragstart="startDragging('${todoId}')" ondragover="highlight('${todoId}')" id="${todoId}" onclick="openDialog('${todoId}')">
      <div class="arrow_flex">
        <div class="card_label">${clean['label']}</div>
        <div class="updown_buttons">
          <button id="updown_arrow" class="d-none" onclick="moveTodo('${todoId}', 'up', event)"><img src="./assets/img/updown.jpg" alt=""></button>
          <button id="updown_arrow_two" class="d-none"  onclick="moveTodo('${todoId}', 'down', event)"><img src="./assets/img/updown.jpg" alt=""></button>
        </div>
      </div>
      <div class="card_title">${clean['title']}</div>
      <div class="card_description">${truncatedDescription}</div>
      <div id="myProgress">
          <div id="myBar" style="width: ${progressWidth}%;"></div>
          <div><span>Subtask 1/2</span></div>
      </div>
        <div class ="space-between w100p">
            <div class="member_flex" id="members_${todoId}">
                ${memberHtml}
            </div>
            <div class="prio_icon_containers">
                <svg width="22" height="20">
                    <use xlink:href="./assets/img/icons/height-prio-icon.svg#height-prio-icon" fill="red"></use>
                </svg>
            </div>
        </div>
    </div>`;
}


async function upload() {
    await setItem('tasks', JSON.stringify(todo));
}


function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(category) {
    todo[currentDraggedElement.split('_')[1]]['category'] = category;
    upload();
    updateBoard();
}

function highlight(todoId) {
    document.getElementById(todoId).classList.add('drag-area-highlight');
}

function removeHighlight(todoId) {
    document.getElementById(todoId).classList.remove('drag-area-highlight');
}

async function renderDialog(selectedTodo) {
    document.getElementById('user_story_dialog').innerHTML = returnDialog(selectedTodo);
    await renderMemberList(selectedTodo);
}

function returnDialog(selectedTodo) {
    return `
    <div class="user_story_label_x_contrainer">
        <div class="user_story">${selectedTodo['label']}<div></div>
        </div>
        <button onclick="closeDialog()">X</button>
    </div>
    <div class="user_story_headline">
        <div> ${selectedTodo['title']} </div>
    </div>
    <div class="user_story_description">${selectedTodo['description']}</div>
    <div class="user_story_date">
        <div class="story_date">Due date:</div>
        <div class="user_date">${selectedTodo['dueDate']}</div>
    </div>
    <div class="user_story_priority">
        <div class="story_priority">Priority:</div>
        <div class="user_priority">${selectedTodo['priority']}</div>
    </div>
    <div class="assigned_to_members_container">
        <div class="assigned_to">Assigned To:</div>
        <div class="assinged_member">
            <div class="member_flex">
                <div  id="board_member_content" class="circle_flex">
            
                </div>
            </div>
        </div>
        <div class="user_story_Subtasks">
            <div>Subtasks</div>
            <div class="subtask_center"><img src="./assets/img/accept.png" alt=""> <span>Implement Recipe
                    Recommendation</span></div>
            <div class="subtask_center"> <img src="./assets/img/checkbox.png" alt=""> <span>Start Page
                    Layout</span></div>
        </div>
        <div class="user_story_delete_edit">
            <div class="user_story_delete_edit_one"><button><img src="./assets/img/delete.png" alt="">
                    <div onclick="deleteTodo(event)">Delete</div>
                </button></div>
            <div class="stripe"></div>
            <div class="user_story_delete_edit_two"><button onclick="editTodo" event><img src="./assets/img/edit.png" alt="">
                    <div>Edit</div>
                </button></div>
        </div>
      `;

}

async function renderMemberList(selectedTodo) {
    document.getElementById('board_member_content').innerHTML = '';
    for (let i = 0; i < selectedTodo.contacts.length; i++) {
        const member = selectedTodo.contacts[i];
        const { profileinitials, secondName } = getInitials(member);
               console.log(member);
        document.getElementById('board_member_content').innerHTML += `
    <div class="circle letter-${secondName.toLowerCase()}">${profileinitials}</div>
    `;
    }
}


function getInitials(contact) {
    const words = contact.split(" ");
    const firstName = words[0][0];
    const secondName = words[1] ? words[1][0] : '';
    const profileinitials = firstName + secondName;
    return { profileinitials, secondName }; // Rückgabe von profileinitials und secondName als Objekt
}


function openDialog(todoId) {
    let id = todoId.split('_')[1];
    let selectedTodo = todo.find(t => t.id == id);
    document.getElementById('dialog_bg').classList.remove('d-none');
    renderDialog(selectedTodo);
}


function closeDialog() {
    document.getElementById('dialog_bg').classList.add('d-none');
}



function filterTodosByTitle() {
    let searchText = document.getElementById('filter_input').value.trim().toLowerCase();


    let filteredTodos = todo.filter(t => t['title'].toLowerCase().startsWith(searchText));

    document.getElementById('task_content_open').innerHTML = '';
    document.getElementById('close_one').innerHTML = '';
    document.getElementById('await_content').innerHTML = '';
    document.getElementById('done_content').innerHTML = '';


    for (let index = 0; index < filteredTodos.length; index++) {
        let clean = filteredTodos[index];
        if (clean.category === 'todos') {
            document.getElementById('task_content_open').innerHTML += generateTodo(clean);
        } else if (clean.category === 'inprogress') {
            document.getElementById('close_one').innerHTML += generateTodo(clean);
        } else if (clean.category === 'await') {
            document.getElementById('await_content').innerHTML += generateTodo(clean);
        } else if (clean.category === 'done') {
            document.getElementById('done_content').innerHTML += generateTodo(clean);
        }
    }
}



let subtaskCount = 2; // Anzahl der Subtasksgit
let progressWidth = (1 / subtaskCount) * 100; // Breite der Fortschrittsanzeige in Prozent
document.getElementById('myBar').style.width = progressWidth + '%';


function setProgress(value) {
    // Stelle sicher, dass der Wert zwischen 0 und 100 liegt
    value = Math.max(0, Math.min(100, value));

    // Setze den Wert der Fortschrittsanzeige
    document.getElementById('progress').style.width = value + "50%";
}

setProgress(50);


/* Überprüfen, ob die Bildschirmorientierungs-API unterstützt wird
if (window.screen.orientation) {
    // Sperren der Bildschirmausrichtung auf "Portrait" (vertikale Ausrichtung)
    window.screen.orientation.lock('portrait').then(function() {
        console.log('Bildschirmausrichtung auf Portrait gesperrt');
    }).catch(function(error) {
        console.error('Fehler beim Sperren der Bildschirmausrichtung:', error);
    });
} else {
    console.error('Die Bildschirmorientierungs-API wird auf diesem Gerät nicht unterstützt.');
}*/


function moveTodo(todoId, direction, event) {
    event.stopPropagation(); // Stoppt die Ereignisweiterleitung, um das Klicken auf das Todo-Element zu verhindern

    const todoElement = document.getElementById(todoId);
    const parentElement = todoElement.parentNode;
    const index = Array.prototype.indexOf.call(parentElement.children, todoElement);
    const category = parentElement.id; // Kategorie der aktuellen Spalte

    let nextCategory;

    // Bestimme die Kategorie der nächsten Spalte basierend auf der Bewegungsrichtung
    if (direction === 'up') {
        switch (category) {
            case 'task_content_open':
                nextCategory = 'close_one';
                break;
            case 'close_one':
                nextCategory = 'await_content';
                break;
            case 'await_content':
                nextCategory = 'done_content';
                break;
            default:
                nextCategory = null;
        }
    } else if (direction === 'down') {
        switch (category) {
            case 'close_one':
                nextCategory = 'task_content_open';
                break;
            case 'await_content':
                nextCategory = 'close_one';
                break;
            case 'done_content':
                nextCategory = 'await_content';
                break;
            default:
                nextCategory = null;
        }
    }

    // Wenn eine gültige nächste Kategorie vorhanden ist
    if (nextCategory) {
        // Ändere die Kategorie des Todos
        todo['category'] = nextCategory;

        // Entferne das Todo-Element aus der aktuellen Spalte
        parentElement.removeChild(todoElement);

        // Füge das Todo-Element in die nächste Spalte ein
        document.getElementById(nextCategory).appendChild(todoElement);
    }
}


function openAddTaskOverlay(category) {
    if (window.innerWidth > 1000) {
        document.getElementById('add-task-form').setAttribute('onsubmit', `startCreateTaskFromBoard("${category}"); return false`);
        document.getElementById('add-task-container').classList.remove('d-none');
    } else {
        var url = 'add_task.html?category=' + category;
        window.location.href = url;
    }
}

async function startCreateTaskFromBoard(category) {
    document.getElementById('add-task-container').classList.add('d-none');
    await createTask(category);
    clearTask();
    boardInit();
    document.getElementById('add-task-form').removeAttribute('onsubmit');
}

function closeAddTaskOverlay() {
    document.getElementById('add-task-container').classList.add('d-none');
    document.getElementById('add-task-form').removeAttribute('onsubmit');
}


function deleteTodo(event){
event.stopPropagation();
    let cleanId = clean.id;
    let selectedTodoIndex = todo.findIndex(t => t.id == cleanId);
    if(selectedTodoIndex !== -1){
        todo.splice(selectedTodoIndex, 1);
        upload()
    }
    closeDialog()
    updateBoard()
}

function editTodo(event) {
event.stopPropagation();
}




function prioImg(){
    if (priority === urgent){
        return  }

    else if(priority === medium){
        return  }
        
    else if(priority === low)
    {return }
}