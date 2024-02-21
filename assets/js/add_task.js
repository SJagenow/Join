let contactList = [];
let selectedUsers = [];
let currentPrio = 'medium';
let currentLabel = '';
let subtasksArray = [];
let tasks = [];
let tasksBeispiel = [
    {
        "id": 0,
        "title": "Kochwelt Recomender",
        "description": "Build start is next week",
        "contacts": [
            "Benedikt Ziegler",
            "David Eisenberg",
            "Eva Fischer"
        ],
        "dueDate": "2024-02-16",
        "priority": "urgent",
        "category": "todos",
        "label": "User Story",
        "subtasks": [
            "das ist ein subtask",
            "das hier ist auch ein subtask wer weis denn sowas moin moin"
        ]
    },
    {
        "id": 1,
        "title": "Kochwelt Recomender",
        "description": "Build start is next week",
        "contacts": [
            "Benedikt Ziegler",
            "David Eisenberg",
            "Eva Fischer"
        ],
        "dueDate": "2024-02-16",
        "priority": "urgent",
        "category": "todos",
        "label": "User Story",
        "subtasks": [
            "das ist ein subtask",
            "das hier ist auch ein subtask wer weis denn sowas moin moin"
        ]
    },
]


/**
 * Initializes the process of adding a new task.
 * 
 * @returns {Promise<void>} A Promise that resolves after initialization.
 */
async function initAddTask() {
    await init();
    loadContactList();
    renderSubtask();
    setDueDateInput();
    // test();
}


/**
 * Fetches and logs the list of tasks from the local storage.
 * 
 * @returns {Promise<void>} A Promise that resolves after fetching and logging the tasks.
 */
async function test() {
    tasks = JSON.parse(await getItem('tasks'));
    console.log(tasks)
}


/**
 * Loads the contact list from local storage and renders it for tasks.
 * 
 * @returns {Promise<void>} A Promise that resolves after loading and rendering the contact list.
 */
async function loadContactList() {
    try {
        contactList = JSON.parse(await getItem('contactList'));
        renderContactListForTask()
    } catch (e) {
        console.error('Loading error:', e);
    }
}


/**
 * Renders the contact list for tasks.
 */
function renderContactListForTask() {
    document.getElementById('add-task-contact').innerHTML = '';
    for (let i = 0; i < contactList.length; i++) {
        let contact = contactList[i].name;
        const name = contact.split(" ");
        const firstName = name[0][0];
        const secondName = name[1] ? name[1][0] : '';
        let initials = firstName + secondName;
        document.getElementById('add-task-contact').innerHTML += /*html*/`
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
function renderContactListForTaskHTML(contact, i, secondName, initials) {
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
 * Toggles the visibility of a dropdown menu.
 * 
 * @param {string} divID - The ID of the dropdown menu container.
 * @param {string} arrow - The ID of the arrow indicating the dropdown state.
 */
function dropdownMenuToggle(divID, arrow) {
    let dNone = document.getElementById(`${divID}`).classList.contains('d-none');
    document.getElementById(`${arrow}`);
    if (dNone) {
        openDropdownMenu(divID, arrow)
    } else {
        closeDropdownMenu(divID, arrow)
    }
}


/**
 * Opens a dropdown menu and rotates the arrow to indicate the open state.
 * 
 * @param {string} divID - The ID of the dropdown menu container.
 * @param {string} arrow - The ID of the arrow indicating the dropdown state.
 */
function openDropdownMenu(divID, arrow) {
    document.getElementById(`${divID}`).classList.remove('d-none');
    document.getElementById(`${arrow}`).style = "transform: rotate(180deg);"
}

/**
 * Closes a dropdown menu and resets the arrow rotation to its initial state.
 * 
 * @param {string} divID - The ID of the dropdown menu container.
 * @param {string} arrow - The ID of the arrow indicating the dropdown state.
 */
function closeDropdownMenu(divID, arrow) {
    document.getElementById(`${divID}`).classList.add('d-none');
    document.getElementById(`${arrow}`).style = "transform: rotate(0);"
}


/**
 * Selects or deselects a contact based on its index and updates the list of selected users.
 * 
 * @param {number} i - The index of the contact.
 */
function selectContact(i) {
    let get = document.getElementById(`add-task-assignet-checkbox${i}`);
    let unchecked = `<use href="assets/img/icons.svg#checkbox-unchecked-icon"></use>`;
    let checked = `<use href="assets/img/icons.svg#checkbox-checked-icon"></use>`;
    let user = contactList[i].name;
    if (get.innerHTML == checked) {
        get.innerHTML = unchecked;
        document.getElementById(`task-contakt${i}`).classList.remove('dark-background');
        selectedUsers = selectedUsers.filter(selectedUser => selectedUser !== user);
    } else {
        get.innerHTML = checked;
        document.getElementById(`task-contakt${i}`).classList.add('dark-background');
        if (!selectedUsers.includes(user)) {
            selectedUsers.push(user);
        }
    }
    updateSelectedUsers(i);
}


/**
 * Updates the list of selected users and renders their initials.
 * 
 * @param {number} i - The index of the contact.
 */
function updateSelectedUsers(i) {
    let contactsDiv = document.getElementById('contacts-div');
    contactsDiv.innerHTML = '';
    selectedUsers.forEach((selectedUser, index) => {
        let nameParts = selectedUser.split(" ");
        let initials = nameParts.map(part => part[0]).join('');
        let secondName = nameParts[1] ? nameParts[1][0].toLowerCase() : '';

        contactsDiv.innerHTML += /*html*/`
            <div class="name-div selected-initials">
                <span class="initials letter-${secondName}">${initials}</span>
            </div>
        `;
    });
}


/**
 * Sets the minimum date for the due date input field to today's date.
 */
function setDueDateInput() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('add-task-date').setAttribute('min', today);
}


/**
 * Changes the priority of the task based on the provided priority level.
 * 
 * @param {string} prio - The priority level ('urgent', 'medium', or 'low').
 */
function changePriority(prio) {
    let urgent = document.getElementById('prio-button-urgent');
    let medium = document.getElementById('prio-button-medium');
    let low = document.getElementById('prio-button-low');
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
 * Retrieves the label for the task from the input field and closes the label dropdown menu.
 */
function typeLabel() {
    currentLabel = document.getElementById('add-task-category').value;
    closeDropdownMenu('add-task-category-list-div', 'category-arrow');
}


/**
 * Selects a label for the task and updates the current label value. Closes the label dropdown menu.
 * 
 * @param {string} label - The label to be selected.
 */
function selectLabel(label) {
    document.getElementById('add-task-category').value = `${label}`;
    currentLabel = document.getElementById('add-task-category').value;
    closeDropdownMenu('add-task-category-list-div', 'category-arrow');
}

/**
 * Renders the list of subtasks in the UI.
 */
function renderSubtask() {
    let subtasks = document.getElementById('subtask-container');
    subtasks.innerHTML = '';
    for (let i = 0; i < subtasksArray.length; i++) {
        const subtask = subtasksArray[i].task;
        subtasks.innerHTML += /*html*/`
        <li id="single-subtask${i}" class="subbtask subbtask-hover" onmouseenter="subtaskEditButtonsOn(${i})" onmouseleave="subtaskEditButtonsOut(${i})" onclick="focusSubtask(${i})">
            <span id="single-subtask-txt${i}" contenteditable="true" class="subbtask-span" value="${subtask}">${subtask}</span>
            <div id="subtask-edit-buttons${i}" class="subtask-icons-single-div" onclick="doNotClose(event)"></div>
        </li>
    `;
    }
}

/**
 * Handles the Enter key event.
 * 
 * @param {Event} event - The key event.
 */
function handleEnterKey(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        event.target.blur();
        addSubtask();
    }
}

/**
 * Adds a subtask to the list of subtasks.
 */
function addSubtask() {
    let subtaskInput = document.getElementById('add-task-subtasks')
    let subtaskInputArray = {
        'task': subtaskInput.value,
        'done': false,
    };
    if (subtaskInput.value.length >= 3) {
        subtasksArray.push(subtaskInputArray);
        initAddTask();
        subtaskInput.value = "";
        closeSubtask();
    } else {
        subtaskInput.reportValidity();
    }
}

/**
 * Closes the subtask input and clears its value.
 */
function closeSubtask() {
    document.getElementById('subbtask-input-icon').innerHTML = /*html*/`
        <button type="button" id="add-subtask-button" formnovalidate onclick="openSubtask()">
            <svg class="subtask-icons">
                <use href="assets/img/icons.svg#plus-add-icon"></use>
            </svg>
        </button>
    `
    document.getElementById('add-task-subtasks').value = '';
}

/**
 * Opens the subtask input for adding a new subtask.
 */
function openSubtask() {
    document.getElementById('subbtask-input-icon').innerHTML = /*html*/`
        <svg class="subtask-icons" onclick="closeSubtask()">
            <use href="assets/img/icons.svg#x-icon"></use>
        </svg>
        <div class="mini-seperator"></div>
        <button type="button" id="add-subtask-button" formnovalidate onclick="addSubtask()">
            <svg class="subtask-icons">
                <use href="assets/img/icons.svg#hook-icon"></use>
            </svg>
        </button>
    `;
    document.getElementById("add-task-subtasks").focus();
}

/**
 * Displays edit and delete buttons for a subtask when hovered over.
 * 
 * @param {number} i - The index of the subtask.
 */
function subtaskEditButtonsOn(i) {
    document.getElementById(`subtask-edit-buttons${i}`).innerHTML = /*html*/`
        <svg class="subtask-icons-single" onclick="focusSubtask(${i})">
            <use href="assets/img/icons.svg#edit-pen"></use>
        </svg>
        <div class="mini-seperator"></div>
        <svg class="subtask-icons-single" onclick="deleteSubtask(${i})">
            <use href="assets/img/icons.svg#trashcan-delete-icon"></use>
        </svg>
    `;
};


/**
 * Hides edit and delete buttons for a subtask when not hovered over.
 * 
 * @param {number} i - The index of the subtask.
 */
function subtaskEditButtonsOut(i) {
    document.getElementById(`subtask-edit-buttons${i}`).innerHTML = '';
};


/**
 * Listens for clicks outside of a specific element and handles the event accordingly.
 * 
 * @param {HTMLElement} element - The HTML element to check for clicks outside.
 * @param {number} i - The index of the subtask.
 */
function onClickOutside(element, i) {
    document.addEventListener('click', e => {
        if (!element.contains(e.target)) {
            document.getElementById(`single-subtask${i}`).setAttribute('onmouseenter', `subtaskEditButtonsOn(${i})`);
            document.getElementById(`single-subtask${i}`).setAttribute('onmouseleave', `subtaskEditButtonsOut(${i})`);
            document.getElementById(`single-subtask${i}`).classList.remove('subbtask-on-focus');
            document.getElementById(`single-subtask${i}`).classList.add('subbtask-hover');
            document.getElementById(`subtask-edit-buttons${i}`).innerHTML = '';
        };
    });
}

/**
 * Starts listening for clicks outside of a specific subtask element and handles the event accordingly.
 * 
 * @param {number} i - The index of the subtask.
 */
function startOnClickOutside(i) {
    const myElement = document.getElementById(`single-subtask${i}`);
    onClickOutside(myElement, i);
}

/**
 * Focuses on a specific subtask for editing.
 * 
 * @param {number} i - The index of the subtask to focus on.
 */
function focusSubtask(i) {
    document.getElementById(`single-subtask${i}`).removeAttribute('onmouseenter');
    document.getElementById(`single-subtask${i}`).removeAttribute('onmouseleave');
    document.getElementById('body').setAttribute('onclick', `closeFunction(); startOnClickOutside(${i})`)
    document.getElementById(`subtask-edit-buttons${i}`).innerHTML = /*html*/`
        <svg class="subtask-icons-single" onclick="deleteSubtask(${i})">
            <use href="assets/img/icons.svg#trashcan-delete-icon"></use>
        </svg>
        <div class="mini-seperator"></div>
        <svg class="subtask-icons-single" onclick="editSubtask(${i})">
            <use href="assets/img/icons.svg#hook-icon"></use>
        </svg>
    `;
    document.getElementById(`single-subtask-txt${i}`).focus();
    document.getElementById(`single-subtask${i}`).classList.add('subbtask-on-focus');
    document.getElementById(`single-subtask${i}`).classList.remove('subbtask-hover');
}


/**
 * Focuses on a specific subtask from the board for editing.
 * 
 * @param {number} i - The index of the subtask to focus on.
 */
function focusSubtaskfromBoard() {
    document.getElementById(`single-subtask${i}`).removeAttribute('onmouseenter');
    document.getElementById(`single-subtask${i}`).removeAttribute('onmouseleave');
    document.getElementById('main-div').setAttribute('onclick', `closeFunction(); startOnClickOutside(${i})`)
    document.getElementById(`subtask-edit-buttons${i}`).innerHTML = /*html*/`
        <svg class="subtask-icons-single" onclick="deleteSubtask(${i})">
            <use href="assets/img/icons.svg#trashcan-delete-icon"></use>
        </svg>
        <div class="mini-seperator"></div>
        <svg class="subtask-icons-single" onclick="editSubtask(${i})">
            <use href="assets/img/icons.svg#hook-icon"></use>
        </svg>
    `;
    document.getElementById(`single-subtask-txt${i}`).focus();
    document.getElementById(`single-subtask${i}`).classList.add('subbtask-on-focus');
    document.getElementById(`single-subtask${i}`).classList.remove('subbtask-hover');
}


/**
 * Edits a subtask by updating its content and re-rendering the subtask.
 * 
 * @param {number} i - The index of the subtask to edit.
 */
function editSubtask(i) {
    const subtask = subtasksArray[i];
    subtasksArray.splice(i, 1, document.getElementById(`single-subtask-txt${i}`).innerHTML);
    document.getElementById(`subtask-edit-buttons${i}`).innerHTML = /*html*/`
        <svg class="subtask-icons-single" onclick="focusSubtask(${i})">
            <use href="assets/img/icons.svg#edit-pen"></use>
        </svg>
        <svg class="subtask-icons-single" onclick="deleteSubtask(${i})">
            <use href="assets/img/icons.svg#trashcan-delete-icon"></use>
        </svg>
`;
    document.getElementById(`single-subtask${i}`).setAttribute('onmouseenter', `subtaskEditButtonsOn(${i})`);
    document.getElementById(`single-subtask${i}`).setAttribute('onmouseleave', `subtaskEditButtonsOut(${i})`);
    document.getElementById(`single-subtask${i}`).classList.remove('subbtask-on-focus');
    console.log(subtasksArray);
}

/**
 * Deletes a subtask from the subtask array and re-renders the subtask list.
 * 
 * @param {number} i - The index of the subtask to delete.
 */
function deleteSubtask(i) {
    subtasksArray.splice(i, 1);
    renderSubtask();
}


/**
 * Closes all dropdown menus and the subtask input field.
 */

function closeFunction() {
    closeDropdownMenu('add-task-contact-div', 'assignet-arrow');
    closeDropdownMenu('add-task-category-list-div', 'category-arrow');
    closeSubtask();
}


/**
 * Clears the task by unchecking all assigned contacts, resetting priority to medium,
 * clearing subtasks, and resetting contact list and selected users.
 */
function clearTask() {
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


async function startCreateTask() {
    let category = 'todos';
    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('category')) {
        category = urlParams.get('category');
    }
    document.getElementById('overlay-div').classList.remove('d-none');
    await createTask(category);
    pauseAndExecute();
}


/**
 * Initiates the creation of a new task by setting the category based on URL parameters,
 * displaying the overlay, and asynchronously creating the task.
 */
async function createTask(category) {
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
 * Redirects the user to the board page after clearing the task and hiding the overlay.
 */
function goToBoard() {
    document.getElementById('clear-task-button').click();
    document.getElementById('overlay-div').classList.add('d-none');
    window.location.href = 'board.html';
}

/**
 * Pauses for a short duration and then executes the function to redirect the user to the board page.
 */
function pauseAndExecute() {
    setTimeout(function () {
        goToBoard();
    }, 1500);
}

/**
 * Deletes all tasks by clearing the tasks array in the local storage.
 * This function is intended for emergency use only.
 * @returns {Promise<void>}
 */
async function deleteAllTasksEmergencyFunction() {
    tasks = JSON.parse(await getItem('tasks'));
    console.log(tasks);
    tasks = [];
    await setItem('tasks', JSON.stringify(tasks));
    let test = JSON.parse(await getItem('tasks'));
    console.log(test);
}


async function addExampleTasks() {
    tasks = JSON.parse(await getItem('tasks'));
    console.log(tasks);
    tasks = [
        {
            "id": 0,
            "title": "Entwicklung neuer Website-Features",
            "description": "Implementierung von zusätzlichen Funktionen auf der Unternehmenswebsite",
            "contacts": [
                "Emmanuel Mauer",
                "Tim Testing"
            ],
            "dueDate": "2024-05-01",
            "priority": "low",
            "category": "todos",
            "label": "HTML",
            "subtasks": [
                {
                    "task": "Header-Design anpassen",
                    "done": false
                },
                {
                    "task": "Navigation hinzufügen",
                    "done": false
                },
                {
                    "task": "Footer aktualisieren",
                    "done": false
                }
            ]
        },
        {
            "id": 1,
            "title": "Benutzeroberfläche für Mobile App gestalten",
            "description": "Design der Benutzeroberfläche für die mobile Anwendung",
            "contacts": [
                "Benedikt Ziegler",
                "Anton Mayer",
                "David Eisenberg"
            ],
            "dueDate": "2024-05-05",
            "priority": "medium",
            "category": "inprogress",
            "label": "User Story",
            "subtasks": [
                {
                    "task": "Startbildschirm entwerfen",
                    "done": true
                },
                {
                    "task": "Anmeldeformular gestalten",
                    "done": false
                }
            ]
        },
        {
            "id": 2,
            "title": "Integration von Zahlungsgateways",
            "description": "Implementierung von Zahlungsoptionen in die Anwendung",
            "contacts": [
                "Eva Fischer",
                "Tim Testing",
                "David Eisenberg",
                "Benedikt Ziegler"
            ],
            "dueDate": "2024-05-10",
            "priority": "urgent",
            "category": "inprogress",
            "label": "Technical Task",
            "subtasks": [
                {
                    "task": "PayPal-Integration",
                    "done": false
                },
                {
                    "task": "Kreditkartenzahlung unterstützen",
                    "done": false
                }
            ]
        },
        {
            "id": 3,
            "title": "Verbesserung der Suchfunktion",
            "description": "Optimierung der Suchfunktion auf der Website",
            "contacts": [
                "Benedikt Ziegler",
                "Anton Mayer"
            ],
            "dueDate": "2024-05-15",
            "priority": "medium",
            "category": "inprogress",
            "label": "User Story",
            "subtasks": [
                {
                    "task": "Autovervollständigung hinzufügen",
                    "done": false
                },
                {
                    "task": "Suchergebnisse filtern",
                    "done": false
                }
            ]
        },
        {
            "id": 4,
            "title": "Entwicklung eines CSS-Frameworks",
            "description": "Erstellung eines benutzerdefinierten CSS-Frameworks für das Projekt",
            "contacts": [
                "David Eisenberg",
                "Benedikt Ziegler",
                "Eva Fischer"
            ],
            "dueDate": "2024-05-20",
            "priority": "medium",
            "category": "await",
            "label": "CSS",
            "subtasks": [
                {
                    "task": "Grid-System entwerfen",
                    "done": false
                },
                {
                    "task": "Responsive Design implementieren",
                    "done": false
                }
            ]
        },
        {
            "id": 5,
            "title": "Durchführung von Systemtests",
            "description": "Tests der Anwendung auf verschiedene Systemkonfigurationen",
            "contacts": [
                "Emmanuel Mauer"
            ],
            "dueDate": "2024-05-25",
            "priority": "urgent",
            "category": "todos",
            "label": "Testing",
            "subtasks": [
                {
                    "task": "Kompatibilität mit verschiedenen Browsern prüfen",
                    "done": false
                },
                {
                    "task": "Performance-Tests durchführen",
                    "done": false
                }
            ]
        },
        {
            "id": 6,
            "title": "Implementierung von Datenbankmigrationen",
            "description": "Aktualisierung der Datenbankstruktur gemäß den neuen Anforderungen",
            "contacts": [
                "Marcel Bauer",
                "Anton Mayer",
                "Benedikt Ziegler"
            ],
            "dueDate": "2024-05-30",
            "priority": "urgent",
            "category": "await",
            "label": "Technical Task",
            "subtasks": [
                {
                    "task": "Schema-Änderungen vornehmen",
                    "done": false
                },
                {
                    "task": "Daten migrieren",
                    "done": false
                }
            ]
        },
        {
            "id": 7,
            "title": "Entwicklung einer Dashboard-Ansicht",
            "description": "Erstellung einer Übersichtsseite für Administratoren",
            "contacts": [
                "David Eisenberg",
                "Anton Mayer",
                "Marcel Bauer"
            ],
            "dueDate": "2024-06-01",
            "priority": "low",
            "category": "todos",
            "label": "User Story",
            "subtasks": [
                {
                    "task": "Benutzerstatistiken anzeigen",
                    "done": false
                },
                {
                    "task": "Grafische Auswertungen erstellen",
                    "done": false
                }
            ]
        },
        {
            "id": 8,
            "title": "Implementierung von OAuth-Authentifizierung",
            "description": "Integration von OAuth-Authentifizierung für externe Plattformen",
            "contacts": [
                "Tim Testing",
                "Anton Mayer",
                "Benedikt Ziegler"
            ],
            "dueDate": "2024-06-05",
            "priority": "medium",
            "category": "done",
            "label": "Technical Task",
            "subtasks": [
                {
                    "task": "OAuth-Anbieter auswählen",
                    "done": true
                },
                {
                    "task": "Authentifizierungsfluss implementieren",
                    "done": true
                }
            ]
        },
        {
            "id": 9,
            "title": "Erstellung eines Testplans",
            "description": "Ausarbeitung eines detaillierten Plans für die Anwendungstests",
            "contacts": [
                "Marcel Bauer",
                "Benedikt Ziegler",
                "Eva Fischer"
            ],
            "dueDate": "2024-06-10",
            "priority": "low",
            "category": "done",
            "label": "Testing",
            "subtasks": [
                {
                    "task": "Testziele definieren",
                    "done": true
                },
                {
                    "task": "Testumgebung einrichten",
                    "done": true
                }
            ]
        }
    ];    
    await setItem('tasks', JSON.stringify(tasks));
    let test = JSON.parse(await getItem('tasks'));
    console.log(test);
}