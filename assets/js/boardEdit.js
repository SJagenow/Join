let currentTaskId;
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

function getPriorityFromForm() {
    const priorityElement = document.querySelector('input[name="task-priority-edit"]:checked');
    if (!priorityElement) {
        console.error('Keine Priorität ausgewählt!');
        return null;
    }
    return priorityElement.value;
}

function getUpdatedSubtasks(taskId) {
    const task = getTaskById(taskId);
    if (!task) {
        console.error('Task nicht gefunden!');
        return [];
    }

    const subtaskContainer = document.getElementById('subtask-container-edit');
    if (!subtaskContainer) {
        console.error('Subtask-Container nicht gefunden!');
        return [];
    }

    const subtasks = [];
    subtaskContainer.querySelectorAll('li.subbtask').forEach((subtaskElement, index) => {
        const titleElement = subtaskElement.querySelector('span[contenteditable="true"]');
        const title = titleElement ? titleElement.textContent.trim() : '';
        if (title) {
            subtasks.push({
                title: title,
                done: task.subtasks[index]?.done || false,
            });
        }
    });

    return subtasks;
}

/**
 * Sets the current label based on the value selected in the edit task form.
 */
function typeLabelEdit() {
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
function renderSubtaskEdit(taskId) {
    const task = todo.find(t => t.id === taskId);
    const subtaskContainer = document.getElementById('subtask-container-edit');

    if (!task || !subtaskContainer) {
        console.error('Task oder Subtask-Container nicht gefunden.');
        return;
    }

    // Leere den Container vor dem Neurendern
    subtaskContainer.innerHTML = '';

    // Gehe durch alle Subtasks des Tasks
    task.subtasks.forEach((subtask, index) => {
        const subtaskElement = document.createElement('li');
        subtaskElement.classList.add('subbtask');
        subtaskElement.setAttribute('data-id', subtask.id || `temp-${index}`); // Fallback-ID, falls keine vorhanden

        subtaskElement.innerHTML = /*html*/ `
            <span 
                contenteditable="true" 
                onblur="saveSubtaskTitle(${taskId}, ${index}, this)">
                ${subtask.title}
            </span>
            <div class="subtask-edit-buttons">
                <svg 
                    class="subtask-icons-single" 
                    onclick="editSubtask(${taskId}, ${index})">
                    <use href="assets/img/icons.svg#edit-pen"></use>
                </svg>
                <div class="mini-seperator"></div>
                <svg 
                    class="subtask-icons-single" 
                    onclick="deleteSubtask(${subtask.id || `'temp-${index}'`}, ${taskId})">
                    <use href="assets/img/icons.svg#trashcan-delete-icon"></use>
                </svg>
            </div>
        `;
        subtaskContainer.appendChild(subtaskElement);
    });
}


function saveSubtaskTitle(taskId, subtaskIndex, element) {
    const task = todo.find(t => t.id === taskId);
    if (task && task.subtasks && task.subtasks[subtaskIndex]) {
        task.subtasks[subtaskIndex].title = element.textContent;
        console.log('Subtask title updated:', task.subtasks[subtaskIndex]);

    }
}


async function loadTodos() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/tasks/');
        if (!response.ok) throw new Error('Fehler beim Laden der Aufgaben');
        todo = await response.json();
        console.log('Todos erfolgreich geladen:', todo);
    } catch (error) {
        console.error('Fehler beim Laden der Todos:', error);
    }
}


function addSubtask(taskId) {
    const subtaskInput = document.getElementById('add-task-subtasks-edit');
    const subtaskTitle = subtaskInput.value.trim();

    if (!subtaskTitle) {
        console.error('Subtask-Titel ist leer');
        return;
    }

   
    const task = todo.find(t => t.id === taskId);
    if (task) {
        const newSubtask = {
            title: subtaskTitle,
            done: false,
            id: `temp-${Date.now()}` 
        };

        task.subtasks.push(newSubtask);

     
        subtasksArray.push(newSubtask);

      
        renderSubtaskEdit(taskId);


        subtaskInput.value = '';
    } else {
        console.error('Aufgabe nicht gefunden');
    }
}

async function loadUpdatedTask(taskId) {
    const response = await fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/`);
    const updatedTask = await response.json();
    const taskIndex = todo.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        todo[taskIndex] = updatedTask;
    }
    renderSubtaskEdit(taskId);
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
        <button type="button" id="add-subtask-button-edit" class="subtask-button-edit" formnovalidate onclick="addSubtask(${i})">
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
        <svg class="subtask-icons-single" onclick="deleteSubtask(subtask.id, taskId)">
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
        <svg class="subtask-icons-single" onclick="deleteSubtask(subtask.id, taskId)">
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
function editTask(taskId) {
    const task = todo[taskId];
    if (!task) {
        console.error('Task nicht gefunden!');
        return;
    }

    document.getElementById('add-task-title-edit').value = task.title;
    document.getElementById('add-task-description-edit').value = task.description;
    document.getElementById('add-task-date-edit').value = task.dueDate;
    document.getElementById('add-task-priority-edit').value = task.priority;


    if (task.subtasks && task.subtasks.length > 0) {
        console.log(task.subtasks);
    } else {
        console.log('Keine Subtasks für diesen Task.');
    }


    document.getElementById('add-task-button-edit').onclick = function() {
        saveTaskEdit(taskId);
    };
}


/**
 * Deletes a subtask from the todo item in the edit mode.
 * @param {number} i - The index of the subtask.
 * @param {number} j - The index of the todo item.
 */
function deleteSubtask(subtaskId, taskId) {
    console.log(`deleteSubtask aufgerufen mit: subtaskId=${subtaskId}, taskId=${taskId}`);

    
    const task = todo.find(t => t.id === taskId);
    if (!task) {
        console.error('Task nicht gefunden.');
        return;
    }

  
    console.log('Subtasks der Task:', task.subtasks);

    let subtaskIndex = -1;

    if (subtaskId.startsWith('temp-')) {
        console.log(`Temporärer Subtask mit ID ${subtaskId} erkannt`);


        subtaskIndex = task.subtasks.findIndex((sub, index) => `temp-${index}` === subtaskId);
        if (subtaskIndex !== -1) {
            console.log(`Temporärer Subtask gefunden:`, task.subtasks[subtaskIndex]);
        } else {
            console.log(`Temporärer Subtask mit ID ${subtaskId} konnte nicht gefunden werden.`);
        }
    } else {
        console.log(`Gespeicherter Subtask mit ID ${subtaskId} erkannt`);

     
        subtaskIndex = task.subtasks.findIndex(sub => sub.id === parseInt(subtaskId));
        if (subtaskIndex !== -1) {
            console.log(`Gespeicherter Subtask gefunden:`, task.subtasks[subtaskIndex]);
        } else {
            console.log(`Gespeicherter Subtask mit ID ${subtaskId} konnte nicht gefunden werden.`);
        }
    }

    if (subtaskIndex !== -1) {
        const subtask = task.subtasks[subtaskIndex];
        task.subtasks.splice(subtaskIndex, 1);

  
        if (!subtaskId.startsWith('temp-')) {
            fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/subtasks/${subtask.id}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Fehler beim Löschen des Subtasks im Backend');
                }
                console.log('Subtask erfolgreich aus dem Backend gelöscht:', subtask.id);
            })
            .catch(err => {
                console.error('Fehler beim Backend-Löschen:', err);
            });
        }

     
        renderSubtaskEdit(taskId);
    } else {
        console.error('Subtask nicht gefunden.');
    }
}


async function saveTaskEdit(taskId) {
    let title = document.getElementById('add-task-title-edit').value.trim();
    let description = document.getElementById('add-task-description-edit').value.trim();
    let dueDate = document.getElementById('add-task-date-edit').value.trim();

    if (!title || !description || !dueDate) {
        console.error('Ein oder mehrere Felder sind leer oder ungültig!');
        return;
    }

   
    const task = todo.find(t => t.id === taskId);
    if (!task) {
        console.error('Task nicht gefunden');
        return;
    }

    const updatedSubtasks = [
        ...(task.subtasks || []),
        ...subtasksArray.filter(subtask => !subtask.id) 
    ];

  
    let contacts = selectedUsers.filter(contactId => contactId);
    const uniqueContacts = [...new Set(contacts)].filter(contact => contact !== undefined && contact !== null);

  
    const updatedTask = {
        title,
        description,
        contacts: uniqueContacts,
        dueDate,
        priority: currentPrio,
        label: currentLabel,
        subtasks: updatedSubtasks.map(subtask => ({
            title: subtask.title,
            done: subtask.done 
        }))
    };

    console.log('Finales Task-Objekt vor dem Senden:', updatedTask);

    
    await updateTaskInBackend(taskId, updatedTask);

    closeEditTodo();
    closeDialog();
    location.reload();
}




async function updateTaskInBackend(taskId, task) {
    console.log("Daten an das Backend zum Update:", task);
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Fehlerdetails:', errorData);
            throw new Error('Fehler beim Aktualisieren der Aufgabe');
        }

        const result = await response.json();
        console.log('Task erfolgreich aktualisiert:', result);
    } catch (error) {
        console.error('Fehler beim Aktualisieren der Aufgabe:', error);
    }
}


/**
 * Clears the task edit form by resetting checkboxes, contact list, priority, and subtasks array.
 */
function clearTaskEdit() {
    let unchecked = `<use href="assets/img/icons.svg#checkbox-unchecked-icon"></use>`;
    let checked = `<use href="assets/img/icons.svg#checkbox-checked-icon"></use>`;
    let contactsDiv = document.getElementById('contacts-div');
    for (let i = 0; i < contactList.length; i++) {
        let get = document.getElementById(`add-task-assignet-checkbox-edit${i}`);
        let contact = contactList[i];
        if (get.innerHTML == checked) {
            get.innerHTML = unchecked;
            document.getElementById(`task-contakt${i}`).classList.remove('dark-background');
        }
    }
    contactsDiv.innerHTML = '';
    changePriorityEdit('medium');
    subtasksArray = [];
    contactList = [];
    selectedUsers = [];
    initAddTask();
}

async function fetchTasks() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/tasks/'); 
        if (!response.ok) {
            throw new Error('Failed to fetch tasks');
        }
        
        const tasks = await response.json(); // Das Array der Tasks, das vom Backend zurückgegeben wird
        todo = tasks; // Das todo-Array wird mit den fetchten Tasks überschrieben
        
        console.log('Fetched tasks:', todo);

    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

/**
 * Loads the contact list from local storage and renders it for tasks.
 * 
 * @returns {Promise<void>} A Promise that resolves after loading and rendering the contact list.
 */

async function loadContactListEdit(taskId) {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/contacts/');

        if (!response.ok) {
            throw new Error('Fehler beim Laden der Kontakte');
        }

        const rawContacts = await response.json();

        const filteredContacts = rawContacts.filter(contact => contact && contact.id);

        renderContactListForTaskEdit(filteredContacts, taskId);  
    } catch (e) {
        console.error('Fehler beim Laden der Kontakte:', e);
    }
}


let selectedContactIds = []; 



function selectContactEdit(contactIndex, taskId) {
    const task = todo.find(t => t.id === taskId); 

    if (!task) {
        console.error(`Aufgabe mit der ID ${taskId} nicht gefunden.`);
        return;
    }

    const selectedContact = contactList[contactIndex];

    if (!selectedContact || !selectedContact.id) {
        console.error('Ungültiger Kontakt:', selectedContact);
        return;
    }

    const isAlreadyAssigned = task.contacts.some(contact => contact.id === selectedContact.id);


    if (isAlreadyAssigned) {
        task.contacts = task.contacts.filter(contact => contact.id !== selectedContact.id);
        selectedUsers = selectedUsers.filter(userId => userId !== selectedContact.id);
    } else {
        task.contacts.push(selectedContact);
        selectedUsers.push(selectedContact.id);
    }

    updateSelectedContactsEdit();
    renderContactListForTaskEdit(contactList, taskId);

    console.log('Aktualisierte Liste der ausgewählten Kontakte:', selectedUsers);
}


function getSelectedContacts() {
    const selectedContactElements = document.querySelectorAll('.contact-checkbox:checked');
    return Array.from(selectedContactElements).map(el => ({
        id: el.value,
     
    }));
}

async function loadSubtasksForTask(taskId) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/`);
        if (!response.ok) throw new Error('Fehler beim Laden der Aufgabe');
        const taskData = await response.json();
        return taskData.subtasks || [];
    } catch (error) {
        console.error('Fehler beim Laden der Subtasks:', error);
        return [];
    }
}

/**
 * Renders the contact list for editing tasks.
 * @param {Array} contactList - List of contacts
 * @param {number} taskId - The ID of the task being edited
 */
function renderContactListForTaskEdit(contactList, taskId) {
    const task = todo.find(t => t.id === taskId); // Hole die Aufgabe anhand der ID

    if (!task || !task.contacts) {
        console.error("Aufgabe oder Kontakte nicht gefunden.");
        return;
    }

    const contactListContainer = document.getElementById('add-task-contact-edit');
    contactListContainer.innerHTML = ''; // Clear existing list

    if (!contactList || contactList.length === 0) {
        console.log("Keine Kontakte verfügbar.");
        return;
    }

    
    contactList.forEach((contact, i) => {
        const nameParts = contact.name.split(" ");
        const firstName = nameParts[0][0]; 
        const secondName = nameParts[1] ? nameParts[1][0] : ''; 
        const initials = firstName + secondName;

       
        const isChecked = task.contacts.some(contactInTask => contactInTask.id === contact.id) || selectedUsers.includes(contact.id);

        const checkboxSVGId = `add-task-assignet-checkbox-edit${i}`;
        const checkboxSVG = isChecked ? 
            `<svg id="${checkboxSVGId}" class="add-task-assignet-checkbox">
                <use href="assets/img/icons.svg#checkbox-checked-icon"></use>
            </svg>` :
            `<svg id="${checkboxSVGId}" class="add-task-assignet-checkbox">
                <use href="assets/img/icons.svg#checkbox-unchecked-icon"></use>
            </svg>`;

        const backgroundClass = isChecked ? 'dark-background' : '';

      
        contactListContainer.innerHTML += /*html*/`
            <div id="task-contakt-edit${i}" class="add-task-single ${backgroundClass}" onclick="selectContactEdit(${i}, ${taskId})">
                <div class="name-div">
                    <span class="initials letter-${secondName.toLowerCase()}">${initials}</span>
                    <span>${contact.name}</span>
                </div>
                <div>
                    ${checkboxSVG}
                </div>
            </div>
        `;
    });
}

/**
 * Filters and renders contacts for adding tasks based on the input value.
 */
function filterContactsForAddTaskEdit() {
    const input = document.getElementById('add-task-assignet-to-edit');
    const filter = input.value.toUpperCase();  // Großbuchstaben für die Suche
    const contactList = document.getElementById('contact-list-edit');  // Der Container für die Kontakte
    const contacts = contactList.getElementsByTagName('li');  // Alle Kontakt-Elemente

    Array.from(contacts).forEach(contact => {
        const name = contact.textContent || contact.innerText;
        if (name.toUpperCase().indexOf(filter) > -1) {
            contact.style.display = ''; 
        } else {
            contact.style.display = 'none';  
        }
    });
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
function renderContactListForTaskEditHTML(contact, i, secondName, initials) {
    return /*html*/`
    <div id="task-contakt-edit${i}" class="add-task-single" onclick="selectContactEdit(${i}, ${taskId})">
        <div class="name-div">
            <span class="initials letter-${secondName.toLowerCase()}">${initials}</span>
           
        </div>
        <div>
            <svg id="add-task-assignet-checkbox-edit${i}" class="add-task-assignet-checkbox">
                <use href="assets/img/icons.svg#checkbox-unchecked-icon"></use>
            </svg>
        </div>
    </div>
`;
}

/**
 * Selects or deselects a contact based on its index and updates the list of selected users.
 * 
 * @param {number} i - The index of the contact.
 */let selectedContacts = selectedUsers;  

function updateSelectedContactsEdit() {
    let contactsDiv = document.getElementById('contacts-div-edit');
    contactsDiv.innerHTML = ''; 

    if (selectedContacts.length === 0) {
        console.log('Keine ausgewählten Kontakte');
        return;
    }

    selectedContactIds.forEach((contactId) => {
       
        const contact = contactList.find(c => c.id === contactId);

        if (contact) {
            let nameParts = contact.name.split(" ");
            let initials = nameParts.map(part => part[0]).join('');
            let secondName = nameParts[1] ? nameParts[1][0].toLowerCase() : '';

            contactsDiv.innerHTML += /*html*/`
                <div class="name-div selected-initials">
                    <span class="initials letter-${secondName}">${initials}</span>
                </div>
            `;
        } else {
            console.error('Kein Kontakt mit ID gefunden:', contactId);
        }
    });
}





// Funktion zum Speichern des bearbeiteten Tasks mit Subtasks
async function updateTaskWithSubtasks(taskId) {
    const task = todo.find(t => t.id === taskId);
    const taskData = {
        title: task.title,
        description: task.description,
        priority: task.priority,
        category: task.category,
        label: task.label,
        dueDate: task.dueDate,
        contacts: task.contacts,
        subtasks: task.subtasks,  
    };

    const response = await fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData)
    });

    if (!response.ok) {
        console.error('Fehler beim Aktualisieren des Tasks');
        return;
    }

    const updatedTask = await response.json();
    todo[taskId] = updatedTask;
    closeEditTodo(); 
}


function getTaskById(taskId) {
    return todo.find(task => task.id === taskId);  
}

/**
 * Edits a todo item.
 * @param {Event} event - The event object.
 * @param {number} i - The index of the todo item to be edited.
 */
async function editTodo(event, taskId) {
    event.stopPropagation();

    console.log('Current todo array:', todo);
    console.log('Task ID provided:', taskId);

    const task = getTaskById(taskId); 
    if (!task) {
        console.error('Task nicht gefunden!');
        return;
    }

    console.log('Found task:', task);
   
    selectedUsers = [...task.contacts];

    loadContactListEdit(taskId); 

    document.getElementById('add-task-form-edit').setAttribute('onsubmit', `updateTask(${taskId}); return false`);
    selectedUsers.push(...task.contacts.map(contact => contact.id));
  
    document.getElementById('add-task-container-edit').classList.remove('d-none');
    document.getElementById('add-task-title-edit').value = task.title;
    document.getElementById('add-task-description-edit').value = task.description;
    document.getElementById('add-task-date-edit').value = task.dueDate;
    changePriorityEdit(task.priority);  
    selectLabelEdit(task.label); 
    renderSubtaskEdit(taskId); 

    const subtaskButton = document.getElementById('add-task-subtasks-edit');
    const addSubtaskButton = document.getElementById('add-subtask-button-edit');
    if (subtaskButton && addSubtaskButton) {
        subtaskButton.removeEventListener('click', openSubtaskEdit);  
        addSubtaskButton.removeEventListener('click', openSubtaskEdit);
        
        subtaskButton.addEventListener('click', () => openSubtaskEdit(taskId));
        addSubtaskButton.addEventListener('click', () => openSubtaskEdit(taskId));

        document.getElementById('add-task-button-edit').setAttribute('onclick', `saveTaskEdit(${taskId})`);
    }
}

/**
 * Closes the edit todo overlay.
 */
function closeEditTodo() {
    document.getElementById('add-task-container-edit').classList.add('d-none');
}

/**
 * Initiates the creation of a new task by setting the category based on URL parameters,
 * displaying the overlay, and asynchronously creating the task.
 */
async function createTaskEdit(i) {
    typeLabelEdit();
    
   
    const taskData = {
        title: todo[i].title,
        description: todo[i].description,
        priority: todo[i].priority,
        category: todo[i].category,
        label: todo[i].label,
        dueDate: todo[i].dueDate, 
        contacts: todo[i].contacts, 
        subtasks: todo[i].subtasks, 
    };

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/tasks/${todo[i].id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData)  
        });

        if (!response.ok) {
            throw new Error(`Error updating task: ${response.status}`);
        }

        const updatedTask = await response.json(); 
        todo[i] = updatedTask;  
        closeEditTodo(); 
    } catch (error) {
        console.error('Error updating task:', error);
    }
}


