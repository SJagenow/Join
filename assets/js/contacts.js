const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
let contactList = [];

async function initContactList() {
    await includeHTML();
    highlightMenuLink();
    await loadContactList();
    renderContactList();
}


/**
 * Asynchronously loads the contact list from the backend storage.
 * If successful, updates the global variable 'contactList' with the parsed JSON data.
 * 
 * @param {Array} contactList - This variable receives the parsed JSON data from the backend.
 */
async function loadContactList() {
    try {
        // Attempt to parse the JSON data retrieved from the backend storage using 'getItem'
        contactList = JSON.parse(await getItem('contactList'));
    } catch (e) {
        // If an error occurs during parsing or retrieval, log the error to the console
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
        const singleLetter = alphabet[i];
        document.getElementById('contact_list').innerHTML += `
        <div id="contactlist_alphabet_sorting_container${i}"> 
            ${singleLetter}  
        </div>
        <div class="divide_container" id="divide_container_${i}">
            <img src="./assets/contactbook/icons_contactbook/Vector 10.svg" alt="">
        </div>
            <div id="contact_list_names${i}">
        </div>
    `;
    }
    renderContactsToList();
}


/**
 * Renders contacts into their corresponding alphabetical rows within the contact list.
 * If no contacts start with a certain letter, hides the corresponding containers.
 * 
 * @param {Array} contactList - The array containing all contacts.
 * @param {Array} alphabet - The array containing all alphabets.
 * @param {HTMLElement[]} namesContainers - An array of HTML elements representing containers for displaying contact names.
 * @param {HTMLElement[]} alphabetContainers - An array of HTML elements representing containers for displaying alphabetical sorting.
 * @param {HTMLElement[]} divideContainers - An array of HTML elements representing containers for dividing sections.
 */
function renderContactsToList() {
    for (let i = 0; i < alphabet.length; i++) {
        const letter = alphabet[i];
        const contactsStartingWithLetter = contactList.filter(contact => contact.name.charAt(0).toUpperCase() === letter);
        const namesContainer = document.getElementById(`contact_list_names${i}`);
        const alphabetContainer = document.getElementById(`contactlist_alphabet_sorting_container${i}`);
        const divideContainer = document.getElementById(`divide_container_${i}`);
        if (contactsStartingWithLetter.length === 0) {
            namesContainer.style.display = 'none';
            alphabetContainer.style.display = 'none';
            divideContainer.style.display = 'none';
        } else {
            renderIntoAlphabetContainer(namesContainer, alphabetContainer, contactsStartingWithLetter, i);
        }
    }
}


/**
 * This function renders contacts into their corresponding alphabetical container within the contact list.
 * 
 * @param {HTMLElement} namesContainer - Container for displaying contact names.
 * @param {HTMLElement} alphabetContainer - Container for displaying the corresponding letter.
 * @param {Array} contactsStartingWithLetter - Array of contacts starting with the same letter.
 * @param {number} alphabetIndex - Index of the current alphabet letter.
 */
function renderIntoAlphabetContainer(namesContainer, alphabetContainer, contactsStartingWithLetter, alphabetIndex) {
    namesContainer.innerHTML = '';
    alphabetContainer.style.display = 'flex';
    contactsStartingWithLetter.forEach((contact, contactIndex) => {
        const { profileinitials, secondName } = getInitials(contact);
        namesContainer.innerHTML += `
        <div class="contact_list_container" id="contact_${alphabetIndex}_${contactIndex}" onclick="renderContact(${alphabetIndex},${contactIndex})">
            <div id="contact_list_initals${alphabetIndex}" class="letter-${secondName.toLowerCase()}">
                ${profileinitials}
            </div>
            <div class="column gap8">
                <div id="contact_list_name${alphabetIndex}">
                    ${contact.name}
                </div>
                <a id="contact_list_mail${alphabetIndex}">
                    ${contact.mail}
                </a>
            </div>
        </div>
        `;
    });
}


function getInitials(contact) {
    const words = contact.name.split(" ");
    const firstName = words[0][0];
    const secondName = words[1] ? words[1][0] : '';
    const profileinitials = firstName + secondName;
    return { profileinitials, secondName }; // Rückgabe von profileinitials und secondName als Objekt
}


/**
 * This function renders detailed information about a contact when selected from the contact list.
 * 
 * @param {number} alphabetIndex - Index of the corresponding alphabetical row.
 * @param {number} contactIndex - Index of the selected contact.
 */
function renderContact(alphabetIndex, contactIndex) {
    const contact = contactList.filter(contact => contact.name.charAt(0).toUpperCase() === alphabet[alphabetIndex])[contactIndex];
    const { profileinitials, secondName } = getInitials(contact);
    let contactoverview = document.getElementById('contact_overview');
    contactoverview.style.display = "flex";
    contactoverview.style.transform = 'translateX(200%)';
    setTimeout(() => {
        contactoverview.innerHTML = ` 
            <div class="contact_information_container">
            <img onclick="closeContact()" src="./assets/img/arrow-left-line.png" alt="">
                <div id="contact_overview_top">
                <div class="contact_list_overview_initals letter-${secondName.toLowerCase()}">
                ${profileinitials}
            </div>
                    <div class="contact_overview_name_container column">
                        <div id="contact_overview_name">
                            ${contact.name}
                        </div>
                        <div class="flex marginL-24">
                            <div id="contactlist_edit_icon_container" onclick="openEditContact(${alphabetIndex}, ${contactIndex})">
                                <span>Edit</span>
                            </div>
                            <div id="contactlist_delete_icon_container" onclick="deleteContact()">
                                <span>Delete</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="contact_information">
                </div>
                <div class="contact_overview_footer">
                    <div class="contact_overview_footer_container">
                        <b>Email</b>
                        <a href="mailto:${contact.mail}" id="contact_overview_mail">
                            ${contact.mail}
                        </a>
                    </div>
                    <div class="contact_overview_footer_container">
                        <b>Phone</b>
                        <a href="tel:${contact.phone}" id="contact_overview_phone">${contact.phone}</a>
                    </div>
                </div>
            </div>
        `;
        addHighlightsToContact(alphabetIndex, contactIndex);
        contactoverview.style.transform = 'translateX(0%)';
    }, 200);
}


function addHighlightsToContact(alphabetIndex, contactIndex) {
    const allContactContainers = document.querySelectorAll('.contact_list_container');
    allContactContainers.forEach(container => {
        container.classList.remove('selected');
    });
    const selectedContainer = document.getElementById(`contact_${alphabetIndex}_${contactIndex}`);
    selectedContainer.classList.add('selected');
}


function openEditContact(alphabetIndex, contactIndex) {
    const contact = contactList.filter(contact => contact.name.charAt(0).toUpperCase() === alphabet[alphabetIndex])[contactIndex];
    showAddContactDialog();
    document.getElementById('contact_edit_button').style.display = "unset";
    document.getElementById('under_headline').style.display = "none";
    document.getElementById('contact_save_button').style.display = "none";
    document.getElementById('contact_cancel_button').style.display = "none";
    document.getElementById('add_contact_headline').innerHTML = `Edit contact`;
    document.getElementById('contactlist_name_input').value = contact.name;
    document.getElementById('contactlist_mail_input').value = contact.mail;
    document.getElementById('contactlist_phone_input').value = contact.phone;

}


function updateContact() {
    deleteContact();
    addToContacts();
}


function closeContact() {
    setTimeout(() => {
        document.getElementById('contact_overview').style.display = "none";
    }, 200);
    document.getElementById('contact_overview').style.transform = 'translateX(200%)';
}


/**
 * This function is used to show the add contact overlay by clicking the 'add new contact' button.
 */
function showAddContactDialog() {
    document.getElementById('contactlist_overlay_container').style.display = 'unset';
    document.getElementById('contact_edit_button').style.display = 'none';
    document.getElementById('under_headline').style.display = 'flex';
    document.getElementById('contact_save_button').style.display = 'flex';
    document.getElementById('contact_cancel_button').style.display = 'flex';
    document.getElementById('add_contact_headline').innerHTML = 'Add contact';
    document.getElementById('contactlist_name_input').value = '';
    document.getElementById('contactlist_mail_input').value = '';
    document.getElementById('contactlist_phone_input').value = '';
    setTimeout(() => {
        document.getElementById('add_contact_overlay').style = 'transform: translateX(0%)';
    }, 100);
}


function showAddContactDialogLowRes() {
    document.getElementById('contactlist_overlay_container').style.display = 'unset';
    setTimeout(() => {
        document.getElementById('add_contact_overlay').style = 'transform: translateY(0%)';
    }, 100);
}


/**
 * This function is given the backgorundcontainer of the overlay to close it by clicking in the background of the overlay.
 */
function closeAddContactDialog() {
    const addContactOverlay = document.getElementById('add_contact_overlay');
    const contactListOverlayContainer = document.getElementById('contactlist_overlay_container');
    if (window.matchMedia("(max-width: 1210px)").matches) {
        addContactOverlay.style.transform = 'translateY(200%)';
    } else {
        addContactOverlay.style.transform = 'translateX(200%)';
    }
    setTimeout(() => {
        contactListOverlayContainer.style.display = 'none';
        renderContactList();
    }, 100);
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
async function addToContacts() {
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
    console.log('updated contactlist:', contactList);
    await setItem('contactList', JSON.stringify(contactList));
    resetAddContactForm(name, mail, phone);
    renderContactList();
    findAlphabetIndex(contact);
    saveContactButton.disabled = false;
}


function findAlphabetIndex(contact) {
    const firstLetter = contact.name.charAt(0).toUpperCase();
    const alphabetIndex = alphabet.indexOf(firstLetter);
    contactsStartingWithLetter = contactList.filter(contact => contact.name.charAt(0).toUpperCase() === firstLetter);
    const contactIndex = contactsStartingWithLetter.indexOf(contact);
    renderContact(alphabetIndex, contactIndex);
}


/**
 * This function is just to reset the inputfields of the 'add contact' overlay.
 * 
 * @param {string} name - It's the inputfield where the name is written in.
 * @param {string} mail - It's the inputfield where the e-mail is written in.
 * @param {string} phone - It's the inputfield where the phonenumber is written in.
 */
function resetAddContactForm(name, mail, phone) {
    name.value = '';
    mail.value = '';
    phone.value = '';
    closeAddContactDialog();
}

async function deleteContact() {
    const contactName = document.getElementById('contact_overview_name').innerText.trim();
    const contactMail = document.getElementById('contact_overview_mail').innerText.trim();
    const indexToDelete = contactList.findIndex(contact => contact.name === contactName && contact.mail === contactMail);
    if (indexToDelete !== -1) {
        const confirmDelete = confirm('Are you sure you want to edit/delete this contact?');
        if (confirmDelete) {
            contactList.splice(indexToDelete, 1);
            console.log('Contact deleted successfully.');
        } else {
            console.log('Deletion of contact canceled.');
            return;
        }
        await setItem('contactList', JSON.stringify(contactList));
        renderContactList();
        document.getElementById('contact_overview').style.transform = 'translateX(200%)';
    }
}

async function handleSubmit() {
    const cancelButton = document.getElementById("contact_cancel_button");
    const saveButton = document.getElementById("contact_save_button");
    const editButton = document.getElementById("contact_edit_button");

    if (event.submitter === cancelButton) {
        console.log("Cancel button clicked");
    } else if (event.submitter === saveButton) {
        await addToContacts();
    } else if (event.submitter === editButton) {
        updateContact();
    }
}
