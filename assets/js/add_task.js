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


function loadContact() {
    document.getElementById('add-task-contact-div').innerHTML;
    getItem('contactList');
}


function selectContact(id) {
    document.getElementById(`add-task-assignet-checkbox${id}`).innerHTML = `<use href="assets/img/icons.svg#checkbox-checked"></use>`;
}

function dropdownMenu() {
    document.getElementById('add-task-contact-div').classList.remove('d-none');
}