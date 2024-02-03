const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
let contactList = [];

/**
 *  This function is used to render an empty contactlist with alphabethical rows
 * 
 * @param {string} singleLetter - This is the letter for each row in the contactlist
 */
function renderContactList() {
    document.getElementById('contact_list').innerHTML = ``;
    document.getElementById('contact_list').innerHTML = `
    <div class="contactlist_button_container">
        <button onclick="showAddContactDialog()">
            Add new contact <img src="./assets/contactbook/icons_contactbook/person_add.svg" alt="">
        </button>
    </div>
    `;
    for (let i = 0; i < alphabet.length; i++) {
        const singleLetter = alphabet[i]; // id's to render alphabet and for every letter and id to render it in
        document.getElementById('contact_list').innerHTML += `
        <div id="contactlist_alphabet_sorting_container${i}"> 
        ${singleLetter}  
        </div>
        <div class="divide_container">
            <svg xmlns="http://www.w3.org/2000/svg" width="354" height="2" viewBox="0 0 354 2" fill="none">
            <path d="M1 1H353" stroke="#D1D1D1" stroke-linecap="round"/>
            </svg>
        </div>
        <div id="contact_list_names${i}">
        <div class="contact_list_container">
            <div id="contact_list_initals${i}"><img class="contact_list_picture" src="./assets/contactbook/img_contactbook/Ellipse 5.svg" alt=""></div>
            <div class="column gap8">
                <div id="contact_list_name${i}">
                    Testing Tim
                </div>
                <a id="contact_list_mail${i}" href="mailto:testingtim@test.de">
                    testingtim@test.de
                </a>
            </div>
        </div>
    </div>
    `;
    }
}

/**
 * This function is used to show the add contact overlay by clicking the 'add new contact' button 
 */
function showAddContactDialog(){
    document.getElementById('contactlist_overlay_container').style.display = 'unset';
}

/**
 * This function is given the backgorundcontainer of the overlay to close it by clicking in the background of the overlay
 */
function closeAddContactDialog(){
    document.getElementById('contactlist_overlay_container').style.display = 'none';
}

/**
 * This function is used to stop the overlay from closing by clicking in it, because its a childcontainer of the clickable 'to close' container in the background
 * 
 * @param {string} event -  In this case its the Mouseclick on the Element thats a child of the 'to close' container in the background
 */
function noClose(event) {
    event.stopPropagation();
  }

/**
 * This function creates a json from the inputs of the 'add contact' overlay and pushes it into the contactlist Array
 * 
 * @param {string} contact - This is the json with all informations from the inputfield. It will be pushed into contactlist
 */
function addToContacts(){
    let name = document.getElementById('contactlist_name_input');
    let mail = document.getElementById('contactlist_mail_input');
    let phone = document.getElementById('contactlist_phone_input');
    let contact = {
            "name": name.value,
            "mail": mail.value,
            "phone": phone.value
    };
    contactList.push(contact);
    console.log('updated contactlist:' ,contactList);
    name.value = '';
    mail.value = '';
    phone.value = '';
    closeAddContactDialog();
} 