let contactList = [];
let selectedUsers = [];
let tasks = [
    {
        'id': 1,
        'label': 'User Story',
        'title': 'Kochwelt Recomender',
        'description': 'Build start is next week',
        'category': 'todos',
        'priority': 'height'
    },
];


/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

function filterFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("myDropdown");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
        txtValue = a[i].textContent || a[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}

function initAddTask() {
    loadContactList();
}

async function loadContactList() {
    try {
        contactList = JSON.parse(await getItem('contactList'));
        console.log(contactList);
        renderContactListForTask()
    } catch(e){
        console.error('Loading error:', e);
    }
}

<<<<<<< HEAD
function renderContactListForTask(contactList) {
=======
function renderContactListForTask() {
>>>>>>> cb32dc9ca216bf7569dd9797b10f7f0f4d1579d9
    for (let i = 0; i < contactList.length; i++) {
        let contact = contactList[i].name;

        const name = contact.split(" ");
        const firstName = name[0][0];
        const secondName = name[1] ? name[1][0] : '';
        let initials = firstName + secondName;


        document.getElementById('add-task-contact').innerHTML += /*html*/`
        <div class="add-task-single" onclick="selectContact(${i})">
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


function  dropdownMenuToggle(divID, arrow) {
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
    document.getElementById(`${arrow}`).style="transform: rotate(180deg);"
}

function closeDropdownMenu(divID, arrow) {
    document.getElementById(`${divID}`).classList.add('d-none');
    document.getElementById(`${arrow}`).style="transform: rotate(0);"
}


function selectContact0(i) {
    let get = document.getElementById(`add-task-assignet-checkbox${i}`);
    let unchecked = `<use href="assets/img/icons.svg#checkbox-unchecked-icon"></use>`;
    let checked = `<use href="assets/img/icons.svg#checkbox-checked-icon"></use>`;
    let user = contactList[i].name;

    if (get.innerHTML == checked) {
        get.innerHTML = unchecked;
        selectedUsers = selectedUsers.filter(selectedUser => selectedUser !== user);
    } else {
        get.innerHTML = checked;
        if (!selectedUsers.includes(user)) {
            selectedUsers.push(user);
        }
    }

    console.log(selectedUsers);
    for (let j = 0; j < selectedUsers.length; j++) {
        let selectedUserCache = selectedUsers[j].user;

        let name = selectedUserCache.split(" ");
        const firstName = name[0][0];
        const secondName = name[1] ? name[1][0] : '';
        let initials = firstName + secondName;

        document.getElementById('contacts-div').innerHTML += /*html*/`
        <div class="add-task-single" onclick="selectContact(${i})">
            <div class="name-div">
                <span class="initials letter-${secondName.toLowerCase()}">${initials}</span>
            </div>
        </div>
        ` ;
    }
}


function selectContact(i) {
    let get = document.getElementById(`add-task-assignet-checkbox${i}`);
    let unchecked = `<use href="assets/img/icons.svg#checkbox-unchecked-icon"></use>`;
    let checked = `<use href="assets/img/icons.svg#checkbox-checked-icon"></use>`;
    let user = contactList[i].name;
    if (get.innerHTML == checked) {
        get.innerHTML = unchecked;
        selectedUsers = selectedUsers.filter(selectedUser => selectedUser !== user);
    } else {
        get.innerHTML = checked;
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


function changePriority(prio) {
    let urgent = document.getElementById('prio-button-urgent');
    let medium = document.getElementById('prio-button-medium');
    let low = document.getElementById('prio-button-low');

    if (prio == 'urgent') {
        if (urgent.classList.contains('urgent')) {
            urgent.classList.remove('urgent');
        } else {
            urgent.classList.add('urgent');
        }
    } else if (prio == 'medium') {
        if (medium.classList.contains('medium')) {
            medium.classList.remove('medium');
        } else {
            medium.classList.add('medium');
        }
    } else if (prio == 'low') {
        if (low.classList.contains('low')) {
            low.classList.remove('low');
        } else {
            low.classList.add('low');
        }
    }
}


function createTask() {
    let task = {
        'id': 1,
        'label': '',
        'title': '',
        'description': '',
        'category': '',
        'priority': '',
        'date':''
    }
    document.getElementById('add-task-button')
}

function clearTask() {
    document.getElementById('add-task-title');
    document.getElementById('add-task-description');
    get
    document.getElementById('add-task-date');
}