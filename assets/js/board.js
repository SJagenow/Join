let todoId;
let clean;
let todo = [{
    'id': 0,
    'label': 'JS',
    'title': 'Drag and Drop Area',
    'description': 'hops von todo nach inprogress await oder done hop hop function drag and drop basteln',
    'category': 'todos'
},
{
    'id': 1,
    'label': 'HTML',
    'title': 'Verschachteln und dann Spachteln',
    'description': 'header menu html erstellen',
    'category': 'todos'
},

{
    'id': 2,
    'label': 'CSS',
    'title': 'Alles an falsche Posi ist Abstrakte Kunst',
    'description': 'margin: -1000px 200px -500px 200px',
    'category': 'todos'
},

{
    'id': 3,
    'label': 'Testing',
    'title': 'Open Dialog',
    'description': 'test dialog',
    'category': 'await'
},
];

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

function generateTodo() {
    let subtaskCount = 2; // Anzahl der Subtasks
    let progressWidth = (1 / subtaskCount) * 100; // Breite der Fortschrittsanzeige in Prozent
    const todoId = `todo_${clean['id']}`;
    
    return `<div draggable="true" ondragstart="startDragging('${todoId}')" ondragover="highlight('${todoId}')" id="${todoId}" onclick="openDialog('${todoId}')">
        <div class="card_label">${clean['label']}</div>
        <div class="card_title">${clean['title']}</div>
        <div class="card_description">${clean['description']}</div>
        <div id="myProgress">
            <div id="myBar" style="width: ${progressWidth}%;"></div>
            <div><span>Subtask 1/2</span></div>
        </div>
        <div class="member_flex">
            <div class="circle_flex">
                <div class="circle">FF</div>
                <div class="circle_two">GG</div>
                <div class="circle_three">WP</div>
                <div class="circle_four">CU</div>
                <div class="circle_five">CU</div>
            </div>
            <div class="prio_icon_containers">
                <svg width="22" height="20">
                    <use xlink:href="./assets/img/icons/height-prio-icon.svg#height-prio-icon" fill="red"></use>
                </svg>
            </div>
        </div>
    </div>`;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(category) {
    todo[currentDraggedElement.split('_')[1]]['category'] = category;   
    updateBoard();
}

function highlight(todoId) {
    document.getElementById(todoId).classList.add('drag-area-highlight');
}

function removeHighlight(todoId) {
    document.getElementById(todoId).classList.remove('drag-area-highlight');
}

function renderDialog(){
 document.getElementById('user_story_dialog').innerHTML = returnDialog();
}

function returnDialog(){
    return   `
    <div class="user_story_label_x_contrainer">
        <div class="user_story">${clean['label']}<div></div>
       
        </div>
        <button onclick="closeDialog()">X</button>
    </div>
    <div class="user_story_headline">

        <div> ${clean['title']} </div>
    </div>
    <div class="user_story_description">${clean['description']}</div>
    <div class="user_story_date">
        <div class="story_date">Due date:</div>
        <div class="user_date">variable(datum)</div>
    </div>
    <div class="user_story_priority">
        <div class="story_priority">Priority:</div>
        <div class="user_priority">Variable(prio)</div>
    </div>
    <div class="assigned_to_members_container">
        <div class="assigned_to">Assigned To:</div>
        <div class="assinged_member">
            <div class="member_flex">
                <div class="circle_flex">
                    <div class="circle">FF</div>
                    <div class="circle_two">GG</div>
                    <div class="circle_three">WP</div>
                    <div class="circle_four">CU</div>
                    <div class="circle_five">CU</div>
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
                    <div>Delete</div>
                </button></div>
            <div class="stripe"></div>
            <div class="user_story_delete_edit_two"><button><img src="./assets/img/edit.png" alt="">
                    <div>Edit</div>
                </button></div>
        </div>
      `
     }


function openDialog(){
    document.getElementById('dialog_bg').classList.remove('d-none');
    renderDialog()
}


function closeDialog(){
    document.getElementById('dialog_bg').classList.add('d-none');
}


let subtaskCount = 2; // Anzahl der Subtasks
let progressWidth = (1 / subtaskCount) * 100; // Breite der Fortschrittsanzeige in Prozent
document.getElementById('myBar').style.width = progressWidth + '%';


function setProgress(value) {
    // Stelle sicher, dass der Wert zwischen 0 und 100 liegt
    value = Math.max(0, Math.min(100, value));
    
    // Setze den Wert der Fortschrittsanzeige
    document.getElementById('progress').style.width = value + "50%";
}

// Setze die Fortschrittsanzeige auf 50% (1/2)
setProgress(50);



// Überprüfen, ob die Bildschirmorientierungs-API unterstützt wird
if (window.screen.orientation) {
    // Sperren der Bildschirmausrichtung auf "Portrait" (vertikale Ausrichtung)
    window.screen.orientation.lock('portrait').then(function() {
        console.log('Bildschirmausrichtung auf Portrait gesperrt');
    }).catch(function(error) {
        console.error('Fehler beim Sperren der Bildschirmausrichtung:', error);
    });
} else {
    console.error('Die Bildschirmorientierungs-API wird auf diesem Gerät nicht unterstützt.');
}