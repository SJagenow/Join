let contact = []
let selectedUser = [];


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
        let contactList = JSON.parse(await getItem('contactList'));
        console.log(contactList);
        renderContactList(contactList)
    } catch(e){
        console.error('Loading error:', e);
    }
}

function renderContactList(contactList) {
    for (let i = 0; i < contactList.length; i++) {
        let contact = contactList[i].name;

        const words = contact.split(" ");
        const firstName = words[0][0];
        const secondName = words[1] ? words[1][0] : '';
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


function selectContact(id) {
    let get = document.getElementById(`add-task-assignet-checkbox${id}`);
    let unchecked = `<use href="assets/img/icons.svg#checkbox-unchecked-icon"></use>`;
    let checked = `<use href="assets/img/icons.svg#checkbox-checked-icon"></use>`;

    if (get.innerHTML == checked) {
        get.innerHTML = unchecked;
    } else {
        get.innerHTML = checked;
    }
}


function  dropdownMenuToggle(id, arrow) {
    let dNone = document.getElementById(`${id}`).classList.contains('d-none');
    document.getElementById(`${arrow}`);

    if (dNone) {
        openDropdownMenu(id, arrow)
    } else {
        closeDropdownMenu(id, arrow)
    }
}

function openDropdownMenu(id, arrow) {
    document.getElementById(`${id}`).classList.remove('d-none');
    document.getElementById(`${arrow}`).style="transform: rotate(180deg);"
}

function closeDropdownMenu(id, arrow) {
    document.getElementById(`${id}`).classList.add('d-none');
    document.getElementById(`${arrow}`).style="transform: rotate(0);"
}