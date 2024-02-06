const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
let contactList = [];

async function init() {
    await includeHTML();
    await loadContactList();
    renderContactList();
}

async function loadContactList(){
    try {
        contactList = JSON.parse(await getItem('contactList'));
    } catch(e){
        console.error('Loading error:', e);
    }
}

/**
 *  This function is used to render an empty contactlist with alphabethical rows.
 * 
 * @param {string} singleLetter - This is the letter for each row in the contactlist.
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
        const singleLetter = alphabet[i]; // id's to render alphabet and for every letter and id to render it in.
        document.getElementById('contact_list').innerHTML += `
        <div id="contactlist_alphabet_sorting_container${i}"> 
        ${singleLetter}  
        </div>
        <div class="divide_container" id="divide_container_${i}">
        <img src="./assets/contactbook/icons_contactbook/Vector 10.svg" alt="">
        </div>
        <div id="contact_list_names${i}">
        <div class="contact_list_container">
            <div id="contact_list_initals${i}"><img class="contact_list_picture" src="./assets/contactbook/img_contactbook/Ellipse 5.svg" alt=""></div>
            <div class="column gap8">
                <div id="contact_list_name${i}">
                    Max Mustermann
                </div>
                <a id="contact_list_mail${i}" href="mailto:testingtim@test.de">
                    testingtim@test.de
                </a>
            </div>
        </div>
    </div>
    `;
    }
    renderContactsToList();
}

function renderContactsToList() {
    for (let i = 0; i < alphabet.length; i++) {
        const letter = alphabet[i];
        const contactsStartingWithLetter = contactList.filter(contact => contact.name.charAt(0).toUpperCase() === letter);
        const namesContainer = document.getElementById(`contact_list_names${i}`);
        const alphabetContainer = document.getElementById(`contactlist_alphabet_sorting_container${i}`);
        const divideContainer = document.getElementById(`divide_container_${i}`);
        if (contactsStartingWithLetter.length === 0) {
            // Keine Kontakte mit diesem Anfangsbuchstaben, daher Container ausblenden
            namesContainer.style.display = 'none';
            alphabetContainer.style.display = 'none';
            divideContainer.style.display = 'none';
        } else {
            // Kontakte vorhanden, Container anzeigen
            namesContainer.innerHTML = '';
            alphabetContainer.style.display = 'block';
            contactsStartingWithLetter.forEach(contact => {
                namesContainer.innerHTML += `
                <div class="contact_list_container">
                    <div id="contact_list_initals${i}"><img class="contact_list_picture" src="./assets/contactbook/img_contactbook/Ellipse 5.svg" alt=""></div>
                    <div class="column gap8">
                        <div id="contact_list_name${i}">
                            ${contact.name}
                        </div>
                        <a id="contact_list_mail${i}" href="mailto:${contact.mail}">
                            ${contact.mail}
                        </a>
                    </div>
                </div>
                `;
            });
        }
    }
}





/**
 * This function is used to show the add contact overlay by clicking the 'add new contact' button.
 */
function showAddContactDialog(){
    document.getElementById('contactlist_overlay_container').style.display = 'unset';
   
}

/**
 * This function is given the backgorundcontainer of the overlay to close it by clicking in the background of the overlay.
 */
function closeAddContactDialog(){
    document.getElementById('contactlist_overlay_container').style.display = 'none';
    renderContactList();
}

/**
 * This function is used to stop the overlay from closing by clicking in it, because its a childcontainer of the clickable 'to close' container in the background.
 * 
 * @param {string} event -  In this case its the Mouseclick on the Element thats a child of the 'to close' container in the background.
 */
function noClose(event) {
    event.stopPropagation();
  }

/**
 * This function creates a json from the inputs of the 'add contact' overlay and pushes it into the contactlist Array and saves it in the backend.
 * 
 * @param {string} contact - This is the json with all informations from the inputfield. It will be pushed into contactlist.
 */
async function addToContacts(){
    let saveContactButton = document.getElementById('contact_save_button');
    saveContactButton.disabled = true;
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
    await setItem('contactList', JSON.stringify(contactList)); // key = contactlist ,value = contactlistArray as text
    resetAddContactForm(name, mail, phone);
} 

/**
 * This function is just to reset the inputfields of the 'add contact' overlay.
 * 
 * @param {string} name - It's the inputfield where the name is written in.
 * @param {string} mail - It's the inputfield where the e-mail is written in.
 * @param {string} phone - It's the inputfield where the phonenumber is written in.
 */

function resetAddContactForm(name, mail, phone){
    name.value = '';
    mail.value = '';
    phone.value = '';
    closeAddContactDialog();
}