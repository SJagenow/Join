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
        

        document.getElementById('add-task-contact').innerHTML += /*html*/`
        <div class="space-between add-task-contact" onclick="selectContact(${i})">
            <div>
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
    document.getElementById(`add-task-assignet-checkbox${id}`).innerHTML = `<use href="assets/img/icons.svg#checkbox-checked-icon"></use>`;
}


function  dropdownMenuToggle() {
    let dNone = document.getElementById('add-task-contact-div').classList.contains('d-none');
    document.getElementById('assignet-arrow')

    if (dNone) {
        openDropdownMenu()
    } else {
        closeDropdownMenu()
    }
}

function openDropdownMenu() {
    document.getElementById('add-task-contact-div').classList.remove('d-none');
    document.getElementById('assignet-arrow').style="transform: rotate(180deg);"
}

function closeDropdownMenu() {
    document.getElementById('add-task-contact-div').classList.add('d-none');
    document.getElementById('assignet-arrow').style="transform: rotate(0);"
}