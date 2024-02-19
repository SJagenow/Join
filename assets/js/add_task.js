let contactList = [];
let selectedUsers = [];
let currentPrio = 'medium';
let currentLabel = '';
let subtasksArray = ['das ist ein subtask', 'das hier ist auch ein subtask wer weis denn sowas moin moin'];
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


async function initAddTask() {
    await init();
    loadContactList();
    renderSubtask();
    setDueDateInput();
    // test();
}


async function test() {
    tasks = JSON.parse(await getItem('tasks'));
    console.log(tasks)
}


async function loadContactList() {
    try {
        contactList = JSON.parse(await getItem('contactList'));
        renderContactListForTask()
    } catch (e) {
        console.error('Loading error:', e);
    }
}


function renderContactListForTask() {
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


// let searchName
// function filterContactsForAddTask() {
//     document.getElementById('add-task-contact').innerHTML = '';
//     searchName = document.getElementById('add-task-assignet-to').value.toLowerCase();
//     let contacts = contactList.filter(checkContact);
//     for (let i = 0; i < contacts.length; i++) {
//         let contact = contacts[i].name;
//         const name = contact.split(" ");
//         const firstName = name[0][0];
//         const secondName = name[1] ? name[1][0] : '';
//         let initials = firstName + secondName;
//         document.getElementById('add-task-contact').innerHTML += renderContactListForTaskHTML(contact, i, secondName, initials);
//     }
// }


// function checkContact(character) {
//     return (character.name.toLowerCase().includes(searchName));
// }


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


function dropdownMenuToggle(divID, arrow) {
    let dNone = document.getElementById(`${divID}`).classList.contains('d-none');
    document.getElementById(`${arrow}`);
    if (dNone) {
        openDropdownMenu(divID, arrow)
    } else {
        closeDropdownMenu(divID, arrow)
    }
}


function openDropdownMenu(divID, arrow) {
    document.getElementById(`${divID}`).classList.remove('d-none');
    document.getElementById(`${arrow}`).style = "transform: rotate(180deg);"
}


function closeDropdownMenu(divID, arrow) {
    document.getElementById(`${divID}`).classList.add('d-none');
    document.getElementById(`${arrow}`).style = "transform: rotate(0);"
}


// function closeContactMenu() {}

// function closeLabelMenu() {}


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


function setDueDateInput() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('add-task-date').setAttribute('min', today);
}


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


function selectLabel(label) {
    document.getElementById('add-task-category').value = `${label}`;
    currentLabel = document.getElementById('add-task-category').value;
    closeDropdownMenu('add-task-category-list-div', 'category-arrow');
}


function renderSubtask() {
    let subtasks = document.getElementById('subtask-container');
    subtasks.innerHTML = '';
    for (let i = 0; i < subtasksArray.length; i++) {
        const subtask = subtasksArray[i];
        subtasks.innerHTML += /*html*/`
        <li id="single-subtask${i}" class="subbtask subbtask-hover" onmouseenter="subtaskEditButtonsOn(${i})" onmouseleave="subtaskEditButtonsOut(${i})" onclick="focusSubtask(${i})">
            <span id="single-subtask-txt${i}" contenteditable="true" class="subbtask-span" value="${subtask}">${subtask}</span>
            <div id="subtask-edit-buttons${i}" class="subtask-icons-single-div" onclick="doNotClose(event)"></div>
        </li>
    `;
    }
}


function addSubtask() {
    let subtaskInput = document.getElementById('add-task-subtasks');
    if (subtaskInput.value.length >= 3) {
        subtasksArray.push(subtaskInput.value);
        initAddTask();
        subtaskInput.value = "";
        closeSubtask();
    } else {
        subtaskInput.reportValidity();
    }
}


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


function subtaskEditButtonsOut(i) {
    document.getElementById(`subtask-edit-buttons${i}`).innerHTML = '';
};


function onClickOutside(element, i) {
    document.addEventListener('click', e => {
        if (!element.contains(e.target)) {
            // document.getElementById('body').removeAttribute('onclick');
            document.getElementById(`single-subtask${i}`).setAttribute('onmouseenter', `subtaskEditButtonsOn(${i})`);
            document.getElementById(`single-subtask${i}`).setAttribute('onmouseleave', `subtaskEditButtonsOut(${i})`);
            document.getElementById(`single-subtask${i}`).classList.remove('subbtask-on-focus');
            document.getElementById(`single-subtask${i}`).classList.add('subbtask-hover');
            document.getElementById(`subtask-edit-buttons${i}`).innerHTML = '';
        };
    });
}


function startOnClickOutside(i) {
    const myElement = document.getElementById(`single-subtask${i}`);
    onClickOutside(myElement, i);
}


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


function focusSubtaskfromBoard () {
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


function deleteSubtask(i) {
    subtasksArray.splice(i, 1);
    renderSubtask();
}


function closeFunction() {
    closeDropdownMenu('add-task-contact-div', 'assignet-arrow');
    closeDropdownMenu('add-task-category-list-div', 'category-arrow');
    closeSubtask();
}


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


async function createTask(category) {
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


function goToBoard() {
    document.getElementById('clear-task-button').click();
    document.getElementById('overlay-div').classList.add('d-none');
    window.location.href = 'board.html';
}

function pauseAndExecute() {
    setTimeout(function () {
        goToBoard();
    }, 1500);
}


async function deleteAllTasksEmergencyFunction() {
    tasks = JSON.parse(await getItem('tasks'));
    console.log(tasks);
    tasks = [];
    await setItem('tasks', JSON.stringify(tasks));
    let test = JSON.parse(await getItem('tasks'));
    console.log(test);
}