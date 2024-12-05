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
async function deleteTodo(event, ID) {
    event.stopPropagation();
    try {
        // Stelle sicher, dass die Task-ID korrekt in die URL eingefügt wird
        const response = await fetch(`http://127.0.0.1:8000/api/tasks/${ID}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            console.log('Task deleted successfully');
            updateBoard();  // Aktualisiere das Board nach dem Löschen
            closeDialog();  // Schließe das Dialogfenster
        } else {
            console.error('Failed to delete task');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}



/**
 * Sets the priority image based on the priority value of the selected todo.
 * @param {string} priority - The priority value of the selected todo.
 * @param {number} selectedTodoID - The ID of the selected todo.
 */
async function prioImg(priority, selectedTodoID) {
    document.getElementById(`Image`).innerHTML = '';
    if (priority === 'urgent') {
        document.getElementById(`Image`).src = "./assets/img/icons/Heightprio.png";
    } else if (priority === 'medium') {
        document.getElementById(`Image`).src = "./assets/img/icons/Mediumprio.png";
    } else if (priority === 'low') {
        document.getElementById(`Image`).src = "./assets/img/icons/Lowprio.png";
    }
}

/**
 * Renders the subtask dialog for the selected todo.
 * @param {object} selectedTodo - The selected todo object.
 */
/**
 * Render the subtasks inside the dialog for the selected todo item.
 * @param {object} selectedTodo - The selected todo object.
 */
async function renderSubtaskDialog(selectedTodo) {
    let subtaskContainer = document.getElementById('subtaskContainer');
    subtaskContainer.innerHTML = ''; // Clear previous content

    if (selectedTodo.subtasks && selectedTodo.subtasks.length > 0) {
        selectedTodo.subtasks.forEach(subtask => {
            const subtaskStatus = subtask.done ? 'done' : 'not-done';
            subtaskContainer.innerHTML += `
                <div class="subtask-item ${subtaskStatus}">
                    <input type="checkbox" ${subtask.done ? 'checked' : ''} disabled />
                    <span>${subtask.title}</span>
                </div>
            `;
        });
    } else {
        subtaskContainer.innerHTML = '<div>No subtasks available.</div>';
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


function closeFunctionEdit() {
    closeDropdownMenu('add-task-contact-div-edit', 'assignet-arrow');
    closeDropdownMenu('add-task-category-list-div-edit', 'category-arrow')
    closeSubtask();
}