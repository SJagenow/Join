let todoId;
let clean;
let todo = [];
let currentDraggedElement;
let subtaskCount;

/**
 * Initializes the board by performing necessary setup tasks.
 * 
 * @returns {Promise<void>} A Promise that resolves when the board is initialized.
 */
async function boardInit() {
    await init();
    await getTodosForBoard();
    updateBoard();
    initAddTask();
}


/**
 * Retrieves the list of todos from storage for the board.
 * 
 * @returns {Promise<void>} A Promise that resolves when the todos are retrieved and logged.
 */
async function getTodosForBoard() {
    todo = JSON.parse(await getItem('tasks'));
    console.log(todo);
}


/**
 * Updates the board with the current list of todos.
 */
function updateBoard() {
    let todos = todo.filter(t => t['category'] == 'todos');
    document.getElementById('task_content_open').innerHTML = '';
    for (let index = 0; index < todos.length; index++) {
        clean = todos[index];
        let { progressWidth, subTasksDone, subTasksTotal } = getSubtaskDoneCounter(clean);
        document.getElementById('task_content_open').innerHTML += generateTodo(clean, progressWidth, subTasksDone, subTasksTotal);
    }
    let inprogress = todo.filter(t => t['category'] == 'inprogress');
    document.getElementById('close_one').innerHTML = '';

    for (let index = 0; index < inprogress.length; index++) {
        clean = inprogress[index];
        let { progressWidth, subTasksDone, subTasksTotal } = getSubtaskDoneCounter(clean);
        document.getElementById('close_one').innerHTML += generateTodo(clean, progressWidth, subTasksDone, subTasksTotal);
    }
    let awaitList = todo.filter(t => t['category'] == 'await');

    document.getElementById('await_content').innerHTML = '';
    for (let index = 0; index < awaitList.length; index++) {
        clean = awaitList[index];
        let { progressWidth, subTasksDone, subTasksTotal } = getSubtaskDoneCounter(clean);
        document.getElementById('await_content').innerHTML += generateTodo(clean, progressWidth, subTasksDone, subTasksTotal);
    }
    let doneList = todo.filter(t => t['category'] == 'done');
    document.getElementById('done_content').innerHTML = '';
    for (let index = 0; index < doneList.length; index++) {
        clean = doneList[index];
        let { progressWidth, subTasksDone, subTasksTotal } = getSubtaskDoneCounter(clean);
        document.getElementById('done_content').innerHTML += generateTodo(clean, progressWidth, subTasksDone, subTasksTotal);
    }
}


/**
 * Sets the current dragged element when starting the drag operation.
 * @param {string} todoId - The ID of the todo being dragged.
 */
function startDragging(todoId) {
    currentDraggedElement = todoId;
}


/**
 * Calculates the number of subtasks done and the progress width for a given task.
 * @param {object} clean - The task object containing subtasks.
 * @returns {object} An object containing the progress width, number of subtasks done, and total number of subtasks.
 */
function getSubtaskDoneCounter(clean) {
    let subTasksTotal = clean.subtasks.length;
    let subTasksDone = 0;
    clean.subtasks.forEach(subtask => {
        if (subtask.done === true) {
            subTasksDone++;
        }
    });
    console.log(`Task mit der ID ${clean.id} hat insgesamt ${subTasksTotal} Tasks und ${subTasksDone} davon erledigt.`);
    let progressWidth = (subTasksDone / subTasksTotal) * 100;
    return { progressWidth, subTasksDone, subTasksTotal }; // progressWidth zurückgeben
}


/**
 * Generates HTML markup for displaying a todo item.
 * @param {object} clean - The task object containing task details.
 * @param {number} progressWidth - The width of the progress bar.
 * @param {number} subTasksDone - The number of subtasks done.
 * @param {number} subTasksTotal - The total number of subtasks.
 * @returns {string} HTML markup representing the todo item.
 */
function generateTodo(clean, progressWidth, subTasksDone, subTasksTotal) {
    const todoId = `todo_${clean['id']}`;
    let descriptionWords = clean['description'].split(' ');
    let truncatedDescription = descriptionWords.slice(0, 5).join(' ');
    if (descriptionWords.length > 5) {
        truncatedDescription += '...';
    }
    let memberHtml = '';
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
        <button id="updown_arrow" class="display_none_arrows" onclick="moveTodo('${todoId}', 'down', event)"><img src="./assets/img/updown.jpg" alt=""></button>
        <button id="updown_arrow_two" class="display_none_arrows"  onclick="moveTodo('${todoId}', 'up', event)"><img src="./assets/img/updown.jpg" alt=""></button>
        
        </div>
    </div>
    <div class="card_title">${clean['title']}</div>
    <div class="card_description">${truncatedDescription}</div>
    <div id="myProgress${todoId}">
        <div id="myBar" style="width: ${progressWidth}%;"></div>
        <div><span>Subtask ${subTasksDone}/${subTasksTotal}</span></div>
    </div>
        <div class ="space-between w100p">
            <div class="member_flex" id="members_${todoId}">
                ${memberHtml}
            </div>
            <div class="prio_icon_containers">
                <svg width="22" height="20">
        const member = clean.contacts[i];
                    <use href="assets/img/icons.svg#${clean.priority}-prio-icon-for-board"></use>
                </svg>
            </div>
        </div>
    </div>`;
}

/**
 * Uploads the current state of tasks to the storage.
 * @returns {Promise<void>}
 */
async function upload() {
    await setItem('tasks', JSON.stringify(todo));
}


/**
 * Prevents the default behavior for a drop event.
 * @param {Event} ev - The drop event.
 */
function allowDrop(ev) {
    ev.preventDefault();
}


/**
 * Moves a todo item to the specified category and updates the board.
 * @param {string} category - The category to which the todo item will be moved.
 */
function moveTo(category) {
    todo[currentDraggedElement.split('_')[1]]['category'] = category;
    upload();
    updateBoard();
}


/**
 * Adds a CSS class to highlight a todo item when it is being dragged over.
 * @param {string} todoId - The ID of the todo item.
 */
function highlight(todoId) {
    document.getElementById(todoId).classList.add('drag-area-highlight');
}

/**
 * Removes a CSS class to remove the highlight from a todo item after dragging.
 * @param {string} todoId - The ID of the todo item.
 */
function removeHighlight(todoId) {
    document.getElementById(todoId).classList.remove('drag-area-highlight');
}

/**
 * Renders a dialog box with details of the selected todo item.
 * @param {object} selectedTodo - The selected todo item object.
 * @param {number} selectedTodoID - The ID of the selected todo item.
 */
async function renderDialog(selectedTodo, selectedTodoID) {
    document.getElementById('user_story_dialog').innerHTML = await returnDialog(selectedTodo, selectedTodoID);
    await prioImg(selectedTodo["priority"], selectedTodoID);
    await renderMemberList(selectedTodo);
    await renderSubtaskDialog(selectedTodo);
}

async function returnDialog(selectedTodo, selectedTodoID) {
    return `
    <div class="user_story_label_x_contrainer">
        <div class="user_story">${selectedTodo['label']}<div></div>
        </div>
        <button onclick="closeDialog()">X</button>
    </div>
    <div id="dialog_title" class="user_story_headline">
        <div> ${selectedTodo['title']} </div>
    </div>
    <div class="user_story_description">${selectedTodo['description']}</div>
    <div class="user_story_date">
        <div class="story_date">Due date:</div>
        <div class="user_date">${selectedTodo['dueDate']}</div>
    </div>
    <div class="user_story_priority">
        <div class="story_priority">Priority:</div>
        <div class="user_priority">${selectedTodo['priority']} <img id="Image" src=""> </div>
    </div>
    <div class="assigned_to_members_container">
        <div class="assigned_to">Assigned To:</div>
        <div class="assinged_member">
            <div class="member_flex">
                <div id="board_member_content" class="circle_flex">

                </div>
            </div>
        </div>
        <div class="user_story_Subtasks">
            <div>Subtasks</div>
            <div class="subtask_center" id="subtaskContainer"><img src="./assets/img/accept.png" alt=""> <span>Implement
                    Recipe
                    Recommendation</span></div>
        </div>
        <div class="user_story_delete_edit">
            <div class="user_story_delete_edit_one"><button class="edit-button"><img src="./assets/img/delete.png" alt="">
                    <div onclick="deleteTodo(event, ${selectedTodoID})">Delete</div>
                </button></div>
            <div class="stripe"></div>
            <div class="user_story_delete_edit_two"><button class="edit-button" onclick="editTodo(event, ${selectedTodoID})"><img
                        src="./assets/img/edit.png" alt="">
                    <div>Edit</div>
                </button></div>
        </div>
        `;
        }


/**
 * Returns the HTML content for a dialog box displaying details of the selected todo item.
 * @param {object} selectedTodo - The selected todo item object.
 * @param {number} selectedTodoID - The ID of the selected todo item.
 * @returns {string} The HTML content for the dialog box.
 */        
async function renderMemberList(selectedTodo) {
    document.getElementById('board_member_content').innerHTML = '';
    for (let i = 0; i < selectedTodo.contacts.length; i++) {
        const member = selectedTodo.contacts[i];
        const { profileinitials, secondName } = getInitials(member);
        console.log(member);
        document.getElementById('board_member_content').innerHTML += `
   <div class="task_name_container"> <div class="circle letter-${secondName.toLowerCase()}">${profileinitials}</div>
    <div>${member}</div></div>
    `;
    }
}

/**
 * Extracts the initials from a contact's name.
 * @param {string} contact - The contact's name.
 * @returns {Object} An object containing the profile initials and the second name's initial.
 */
function getInitials(contact) {
    const words = contact.split(" ");
    const firstName = words[0][0];
    const secondName = words[1] ? words[1][0] : '';
    const profileinitials = firstName + secondName;
    return { profileinitials, secondName };
}


/**
 * Opens a dialog box for the selected todo item.
 * @param {string} todoId - The ID of the todo item.
 */
function openDialog(todoId) {
    let id = todoId.split('_')[1];
    let selectedTodo = todo.find(t => t.id == id);
    let selectedTodoID = selectedTodo.id;
    document.getElementById('dialog_bg').classList.remove('d-none');
    renderDialog(selectedTodo, selectedTodoID);
}

/**
 * Closes the dialog box.
 */
function closeDialog() {
    document.getElementById('dialog_bg').classList.add('d-none');
}

/**
 * Filters todos by their title.
 * Updates the board with filtered todos based on the input value.
 */
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
            let { progressWidth, subTasksDone, subTasksTotal } = getSubtaskDoneCounter(clean);
            document.getElementById('task_content_open').innerHTML += generateTodo(clean, progressWidth, subTasksDone, subTasksTotal);
        } else if (clean.category === 'inprogress') {
            let { progressWidth, subTasksDone, subTasksTotal } = getSubtaskDoneCounter(clean);
            document.getElementById('close_one').innerHTML += generateTodo(clean, progressWidth, subTasksDone, subTasksTotal);
        } else if (clean.category === 'await') {
            let { progressWidth, subTasksDone, subTasksTotal } = getSubtaskDoneCounter(clean);
            document.getElementById('await_content').innerHTML += generateTodo(clean, progressWidth, subTasksDone, subTasksTotal);
        } else if (clean.category === 'done') {
            let { progressWidth, subTasksDone, subTasksTotal } = getSubtaskDoneCounter(clean);
            document.getElementById('done_content').innerHTML += generateTodo(clean, progressWidth, subTasksDone, subTasksTotal);
        }
    }
}

/**
 * Moves a todo element in the specified direction within its parent category.
 * @param {string} todoId - The ID of the todo element to be moved.
 * @param {string} direction - The direction in which to move the todo element ('up' or 'down').
 * @param {Event} event - The event object.
 */
function moveTodo(todoId, direction, event) {
    event.stopPropagation();
    const todoElement = document.getElementById(todoId);
    const parentElement = todoElement.parentNode;
    const index = Array.prototype.indexOf.call(parentElement.children, todoElement);
    const category = parentElement.id;
    let nextCategory;
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
    if (nextCategory) {
        todo['category'] = nextCategory;
        parentElement.removeChild(todoElement);
        document.getElementById(nextCategory).appendChild(todoElement);
    }
}

/**
 * Opens the overlay for adding a new task.
 * If the window width is greater than 1000 pixels, it displays the form in the overlay;
 * otherwise, it redirects to the add_task.html page with the specified category.
 * @param {string} category - The category of the task to be added.
 */
function openAddTaskOverlay(category) {
    if (window.innerWidth > 1000) {
        document.getElementById('add-task-form').setAttribute('onsubmit', `startCreateTaskFromBoard("${category}"); return false`);
        document.getElementById('add-task-container').classList.remove('d-none');
    } else {
        var url = 'add_task.html?category=' + category;
        window.location.href = url;
    }
}


/**
 * Starts the process of creating a new task from the board overlay.
 * Hides the add task container, creates a new task in the specified category,
 * clears the task input fields, updates the board, and removes the 'onsubmit' attribute from the form.
 * @param {string} category - The category of the task to be created.
 */
async function startCreateTaskFromBoard(category) {
    document.getElementById('add-task-container').classList.add('d-none');
    await createTask(category);
    clearTask();
    boardInit();
    document.getElementById('add-task-form').removeAttribute('onsubmit');
}

/**
 * Closes the add task overlay by adding the 'd-none' class to the add task container
 * and removing the 'onsubmit' attribute from the add task form.
 */
function closeAddTaskOverlay() {
    document.getElementById('add-task-container').classList.add('d-none');
    document.getElementById('add-task-form').removeAttribute('onsubmit');
}

/**
 * Deletes a todo item from the list.
 * @param {Event} event - The event object.
 * @param {number} ID - The ID of the todo item to be deleted.
 */
function deleteTodo(event, ID) {
    event.stopPropagation();
    todo.splice(ID, 1);
    upload();
    closeDialog();
    updateBoard();
}


/**
 * Sets the priority image based on the priority value of the selected todo.
 * @param {string} priority - The priority value of the selected todo.
 * @param {number} selectedTodoID - The ID of the selected todo.
 */
async function prioImg(priority, selectedTodoID) {
    console.log(selectedTodoID);
    document.getElementById(`Image`).innerHTML = '';
    if (priority === 'urgent') {
        document.getElementById(`Image`).src = "../assets/img/icons/Heightprio.png";
    } else if (priority === 'medium') {
        document.getElementById(`Image`).src = "../assets/img/icons/Mediumprio.png";
    } else if (priority === 'low') {
        document.getElementById(`Image`).src = "../assets/img/icons/Lowprio.png";
    }
}

/**
 * Renders the subtask dialog for the selected todo.
 * @param {object} selectedTodo - The selected todo object.
 */
async function renderSubtaskDialog(selectedTodo) {
    document.getElementById('subtaskContainer').innerHTML = '';
    for (let i = 0; i < selectedTodo.subtasks.length; i++) {
        const subtask = selectedTodo.subtasks[i].task;
        if (selectedTodo.subtasks[i].done == false) {
            document.getElementById('subtaskContainer').innerHTML += `  <div class="subbtask_subspan"><img id="checkBoxDialogImg${i}" onclick="checkBoxSwitchImg(${i}, ${selectedTodo.id})" src="./assets/img/checkbox.png" alt=""> ${subtask} </div>`;
        } else {
            document.getElementById('subtaskContainer').innerHTML += `  <div class="subbtask_subspan"><img id="checkBoxDialogImg${i}" onclick="checkBoxSwitchImg(${i}, ${selectedTodo.id})" src="./assets/img/checkedButtondialog.png" alt=""> ${subtask} </div>`;
        }
    }
}

/**
 * Switches the checkbox image and updates the todo's subtask status.
 * @param {number} i - The index of the subtask.
 * @param {number} ID - The ID of the todo.
 */
function checkBoxSwitchImg(i, ID) {
    let checkbox = document.getElementById(`checkBoxDialogImg${i}`);
    let unchecked = `./assets/img/checkbox.png`;
    let checked = `./assets/img/checkedButtondialog.png`;
    if (todo[ID].subtasks[i].done == false) {
        checkbox.src = checked;
        todo[ID].subtasks[i].done = true;
        upload();
        updateBoard();
    } else {
        checkbox.src = unchecked;
        todo[ID].subtasks[i].done = false;
        upload();
        updateBoard();
    }
}


/**
 * Changes the priority of the todo being edited and updates the UI accordingly.
 * @param {string} prio - The priority value ('urgent', 'medium', or 'low').
 */
function changePriorityEdit(prio) {
    let urgent = document.getElementById('prio-button-urgent-edit');
    let medium = document.getElementById('prio-button-medium-edit');
    let low = document.getElementById('prio-button-low-edit');
    if (prio == 'urgent') {
        if (urgent.classList.contains('urgent')) {
        } else {
            urgent.classList.add('urgent');
            currentPrio = 'urgent';
            medium.classList.remove('medium');
            low.classList.remove('low');
        }
    } else if (prio == 'medium') {
        if (medium.classList.contains('medium')) {
        } else {
            medium.classList.add('medium');
            currentPrio = 'medium';
            urgent.classList.remove('urgent');
            low.classList.remove('low');
        }
    } else if (prio == 'low') {
        if (low.classList.contains('low')) {
        } else {
            low.classList.add('low');
            currentPrio = 'low';
            urgent.classList.remove('urgent');
            medium.classList.remove('medium');
        }
    }
}

/**
 * Sets the current label based on the value selected in the edit task form.
 */
function typeLabel() {
    currentLabel = document.getElementById('add-task-category-edit').value;
    closeDropdownMenu('add-task-category-list-div-edit', 'category-arrow');
}

/**
 * Selects the label in the edit task form based on the provided label value.
 * @param {string} label - The label value to be selected.
 */
function selectLabelEdit(label) {
    document.getElementById('add-task-category-edit').value = `${label}`;
    currentLabel = document.getElementById('add-task-category-edit').value;
    closeDropdownMenu('add-task-category-list-div-edit', 'category-arrow');
}


/**
 * Renders the subtask edit section in the task edit form.
 * @param {number} j - The index of the todo item.
 */
function renderSubtaskEdit(j) {
    let subtasks = document.getElementById('subtask-container-edit');
    subtasks.innerHTML = '';
    for (let i = 0; i < todo[j].subtasks.length; i++) {
        const subtask = todo[j].subtasks[i].task;
        subtasks.innerHTML += /*html*/`
        <li id="single-subtask-edit${i}" class="subbtask subbtask-hover" onmouseenter="subtaskEditButtonsOnEdit(${i})" onmouseleave="subtaskEditButtonsOutEdit(${i})" onclick="focusSubtaskEdit(${i}, ${j})">
            <span id="single-subtask-txt-edit${i}" contenteditable="true" class="subbtask-span" value="${subtask}">${subtask}</span>
            <div id="subtask-edit-buttons-edit${i}" class="subtask-icons-single-div" onclick="doNotClose(event)"></div>
        </li>
    `;
    }
}

/**
 * Adds a subtask to the todo item being edited.
 * @param {number} i - The index of the todo item.
 */
function addSubtaskEdit(i) {
    let subtaskInput = document.getElementById('add-task-subtasks-edit');
    let subtaskInputArray = {
        'task': subtaskInput.value,
        'done': false,
    };
    if (subtaskInput.value.length >= 3) {
        todo[i].subtasks.push(subtaskInputArray);
        renderSubtaskEdit(i);
        subtaskInput.value = "";
        closeSubtask();
    } else {
        subtaskInput.reportValidity();
    }

}


/**
 * Opens the subtask edit dialog for the specified todo item.
 * @param {number} i - The index of the todo item.
 */
function openSubtaskEdit(i) {
    document.getElementById('subbtask-input-icon-edit').innerHTML = /*html*/`
        <svg class="subtask-icons" onclick="closeSubtaskEdit(${i})">
            <use href="assets/img/icons.svg#x-icon"></use>
        </svg>
        <div class="mini-seperator"></div>
        <button type="button" id="add-subtask-button-edit" class="subtask-button-edit" formnovalidate onclick="addSubtaskEdit(${i})">
            <svg class="subtask-icons">
                <use href="assets/img/icons.svg#hook-icon"></use>
            </svg>
        </button>
    `;
    document.getElementById("add-task-subtasks-edit").focus();
}


/**
 * Closes the subtask edit dialog.
 * @param {number} i - The index of the todo item.
 */
function closeSubtaskEdit(i) {
    document.getElementById('subbtask-input-icon-edit').innerHTML = /*html*/`
        <button type="button" id="add-subtask-button-edit" class="subtask-button-edit" formnovalidate onclick="openSubtaskEdit(${i})">
            <svg class="subtask-icons">
                <use href="assets/img/icons.svg#plus-add-icon"></use>
            </svg>
        </button>
    `
    document.getElementById('add-task-subtasks-edit').value = '';
}

/**
 * Handles the mouseenter event for subtask edit buttons.
 * @param {number} i - The index of the subtask.
 * @param {number} j - The index of the todo item.
 */
function subtaskEditButtonsOnEdit(i, j) {
    document.getElementById(`subtask-edit-buttons-edit${i}`).innerHTML = /*html*/`
        <svg class="subtask-icons-single" onclick="focusSubtaskEdit(${i}, ${j})">
            <use href="assets/img/icons.svg#edit-pen"></use>
        </svg>
        <div class="mini-seperator"></div>
        <svg class="subtask-icons-single" onclick="deleteSubtaskEdit(${i}, ${j})">
            <use href="assets/img/icons.svg#trashcan-delete-icon"></use>
        </svg>
    `;
};

/**
 * Handles the mouseleave event for subtask edit buttons.
 * @param {number} i - The index of the subtask.
 * @param {number} j - The index of the todo item.
 */
function subtaskEditButtonsOutEdit(i, j) {
    document.getElementById(`subtask-edit-buttons-edit${i}`).innerHTML = '';
};


/**
 * Focuses on editing a subtask and displays edit/delete buttons.
 * @param {number} i - The index of the subtask.
 * @param {number} j - The index of the todo item.
 */
function focusSubtaskEdit(i, j) {
    document.getElementById(`single-subtask-edit${i}`).removeAttribute('onmouseenter');
    document.getElementById(`single-subtask-edit${i}`).removeAttribute('onmouseleave');
    document.getElementById('body').setAttribute('onclick', `closeFunctionEdit(); startOnClickOutsideEdit(${i}, ${j})`)
    document.getElementById(`subtask-edit-buttons-edit${i}`).innerHTML = /*html*/`
        <svg class="subtask-icons-single" onclick="deleteSubtaskEdit(${i}, ${j})">
            <use href="assets/img/icons.svg#trashcan-delete-icon"></use>
        </svg>
        <div class="mini-seperator"></div>
        <svg class="subtask-icons-single" onclick="editSubtaskEdit(${i}, ${j})">
            <use href="assets/img/icons.svg#hook-icon"></use>
        </svg>
    `;
    document.getElementById(`single-subtask-txt-edit${i}`).focus();
    document.getElementById(`single-subtask-edit${i}`).classList.add('subbtask-on-focus');
    document.getElementById(`single-subtask-edit${i}`).classList.remove('subbtask-hover');
}

/**
 * Listens for clicks outside the specified element and triggers actions accordingly.
 * @param {HTMLElement} element - The HTML element.
 * @param {number} i - The index of the subtask.
 * @param {number} j - The index of the todo item.
 */
function onClickOutsideEdit(element, i, j) {
    document.addEventListener('click', e => {
        if (!element.contains(e.target)) {
            document.getElementById(`single-subtask-edit${i}`).setAttribute('onmouseenter', `subtaskEditButtonsOnEdit(${i}, ${j})`);
            document.getElementById(`single-subtask-edit${i}`).setAttribute('onmouseleave', `subtaskEditButtonsOutEdit(${i}, ${j})`);
            document.getElementById(`single-subtask-edit${i}`).classList.remove('subbtask-on-focus');
            document.getElementById(`single-subtask-edit${i}`).classList.add('subbtask-hover');
            document.getElementById(`subtask-edit-buttons-edit${i}`).innerHTML = '';
        };
    });
}

/**
 * Starts listening for clicks outside the specified element and triggers actions accordingly.
 * @param {number} i - The index of the subtask.
 * @param {number} j - The index of the todo item.
 */
function startOnClickOutsideEdit(i, j) {
    const myElement = document.getElementById(`single-subtask-edit${i}, ${j}`);
    onClickOutsideEdit(myElement, i, j);
}

/**
 * Edits the content of a subtask in the edit mode.
 * @param {number} i - The index of the subtask.
 * @param {number} j - The index of the todo item.
 */
function editSubtaskEdit(i, j) {
    const subtask = todo[j].subtasks[i];
    console.log('ijarnfgn', subtask);
    subtask.splice(i, 1, document.getElementById(`single-subtask-txt-edit${i}`).innerHTML);
    document.getElementById(`subtask-edit-buttons-edit${i}`).innerHTML = /*html*/`
        <svg class="subtask-icons-single" onclick="focusSubtaskEdit(${i})">
            <use href="assets/img/icons.svg#edit-pen"></use>
        </svg>
        <svg class="subtask-icons-single" onclick="deleteSubtaskEdit(${i}, ${j})">
            <use href="assets/img/icons.svg#trashcan-delete-icon"></use>
        </svg>
`;
    document.getElementById(`single-subtask-edit${i}`).setAttribute('onmouseenter', `subtaskEditButtonsOnEdit(${i})`);
    document.getElementById(`single-subtask-edit${i}`).setAttribute('onmouseleave', `subtaskEditButtonsOutEdit(${i})`);
    document.getElementById(`single-subtask-edit${i}`).classList.remove('subbtask-on-focus');
}

/**
 * Deletes a subtask from the todo item in the edit mode.
 * @param {number} i - The index of the subtask.
 * @param {number} j - The index of the todo item.
 */
function deleteSubtaskEdit(i, j) {
    todo[j].subtasks.splice(i, 1);
    upload();
    renderSubtaskEdit(j);
}


function clearTaskEdit() {
    let unchecked = `<use href="assets/img/icons.svg#checkbox-unchecked-icon"></use>`;
    let checked = `<use href="assets/img/icons.svg#checkbox-checked-icon"></use>`;
    let contactsDiv = document.getElementById('contacts-div');
    for (let i = 0; i < contactList.length; i++) {
        let get = document.getElementById(`add-task-assignet-checkbox${i}`);
        let contact = contactList[i];
        if (get.innerHTML == checked) {
            get.innerHTML = unchecked;
            document.getElementById(`task-contakt${i}`).classList.remove('dark-background');
        }
    }
    contactsDiv.innerHTML = '';
    changePriority('medium');
    subtasksArray = [];
    contactList = [];
    selectedUsers = [];
    initAddTask();
}


async function startEditTask() {
    let category = 'todos';
    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('category')) {
        category = urlParams.get('category');
    }
    document.getElementById('overlay-div').classList.remove('d-none');
    await createTask(category);
    pauseAndExecute();
}


async function editTask(category) {
    typeLabel();
    tasks = JSON.parse(await getItem('tasks'));
    let task = {
        "id": tasks.length,
        "title": document.getElementById('add-task-title').value,
        "description": document.getElementById('add-task-description').value,
        "contacts": selectedUsers,
        "dueDate": document.getElementById('add-task-date').value,
        "priority": currentPrio,
        "category": category,
        "label": currentLabel,
        "subtasks": subtasksArray,
    };
    tasks.push(task);
    await setItem('tasks', JSON.stringify(tasks));
}


/**
 * Loads the contact list from local storage and renders it for tasks.
 * 
 * @returns {Promise<void>} A Promise that resolves after loading and rendering the contact list.
 */
async function loadContactListEdit() {
    try {
        contactList = JSON.parse(await getItem('contactList'));
        renderContactListForTaskEdit()
    } catch (e) {
        console.error('Loading error:', e);
    }
}


/**
 * Renders the contact list for tasks.
 */
function renderContactListForTaskEdit() {
    document.getElementById('add-task-contact-edit').innerHTML = '';
    for (let i = 0; i < contactList.length; i++) {
        let contact = contactList[i].name;
        const name = contact.split(" ");
        const firstName = name[0][0];
        const secondName = name[1] ? name[1][0] : '';
        let initials = firstName + secondName;
        document.getElementById('add-task-contact-edit').innerHTML += /*html*/`
        <div id="task-contakt-edit${i}" class="add-task-single" onclick="selectContact(${i})">
            <div class="name-div">
                <span class="initials letter-${secondName.toLowerCase()}">${initials}</span>
                <span>${contact}</span>
            </div>
            <div>
                <svg id="add-task-assignet-checkbox${i}" class="add-task-assignet-checkbox">
                    <use href="assets/img/icons.svg#checkbox-unchecked-icon"></use>
                </svg>
            </div>
        </div>
    `;
    }
}


/**
 * Filters and renders contacts for adding tasks based on the input value.
 */
async function filterContactsForAddTask() {
    document.getElementById('add-task-contact').innerHTML = '';
    let value = document.getElementById('add-task-assignet-to').value.toLowerCase();
    for (let i = 0; i < contactList.length; i++) {
        let checkContact = contactList[i].name.toLowerCase();
        if (checkContact.includes(value)) {
            let contact = contactList[i].name;
            const name = contact.split(" ");
            const firstName = name[0][0];
            const secondName = name[1] ? name[1][0] : '';
            let initials = firstName + secondName;
            document.getElementById('add-task-contact').innerHTML += renderContactListForTaskHTML(contact, i, secondName, initials);
        }
    }
}


/**
 * Generates HTML markup for rendering a contact in the task list.
 * 
 * @param {string} contact - The name of the contact.
 * @param {number} i - The index of the contact.
 * @param {string} secondName - The second name of the contact.
 * @param {string} initials - The initials of the contact.
 * @returns {string} HTML markup for rendering the contact.
 */
function renderContactListForTasEditkHTML(contact, i, secondName, initials) {
    return /*html*/`
    <div id="task-contakt${i}" class="add-task-single" onclick="selectContact(${i})">
        <div class="name-div">
            <span class="initials letter-${secondName.toLowerCase()}">${initials}</span>
            <span>${contact}</span>
        </div>
        <div>
            <svg id="add-task-assignet-checkbox${i}" class="add-task-assignet-checkbox">
                <use href="assets/img/icons.svg#checkbox-unchecked-icon"></use>
            </svg>
        </div>
    </div>
`;
}


/**
 * Edits a todo item.
 * @param {Event} event - The event object.
 * @param {number} i - The index of the todo item to be edited.
 */
function editTodo(event, i) {
    loadContactListEdit();
    event.stopPropagation();
    document.getElementById('add-task-container-edit').classList.remove('d-none');
    document.getElementById('add-task-title-edit').value = `${todo[i].title}`;
    document.getElementById('add-task-description-edit').value = `${todo[i].description}`;
    document.getElementById('add-task-date-edit').value = `${todo[i].dueDate}`;
    changePriorityEdit(todo[i].priority);
    selectLabelEdit(todo[i].label);
    console.log(todo[i].label);
    renderSubtaskEdit(i);
    document.getElementById('add-task-subtasks-edit').setAttribute('onclick', `openSubtaskEdit(${i})`);
    document.getElementById('add-subtask-button-edit').setAttribute('onclick', `openSubtaskEdit(${i})`);
}

/**
 * Closes the edit todo overlay.
 */
function closeEditTodo() {
    document.getElementById('add-task-container-edit').classList.add('d-none');
}