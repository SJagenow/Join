const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
let contactList = [];


/**
 * Initializes the contact list by calling other initialization functions and rendering the contact list.
 * 
 * @returns {Promise<void>} A Promise that resolves once the contact list is initialized and rendered.
 */
async function initContactList() {
    await init(); 
    await loadContactList(); 
    renderContactList();
}


async function removeInvalidEntries(array) {
    array.splice(9, 1); 
    await setItem('contactList', JSON.stringify(contactList));
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
    renderContactlistTop();
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
    renderInitialsOfUser();
}


/**
 * Renders the top section of the contact list with options for adding a new contact.
 */
function renderContactlistTop(){
    document.getElementById('contact_list').innerHTML = `
    <div class="contactlist_button_container">
        <button onclick="showAddContactDialog()">
            Add new contact <img src="./assets/contactbook/icons_contactbook/person_add.svg" alt="">
        </button>
    </div>
    <div class="contact_list_container" id="contact_me" renderContact('me', 'me')>
    <div id="contact_list_initals" class="">
    </div>
    <div class="column gap8">
        <div id="contact_list_name">
            ${userName}(Me)
        </div>
        <a id="contact_list_mail}">
            ${userEmail}
        </a>
    </div>
</div>
    <div></div>
    `;

}


/**
 * Creates a new contact for the current user and adds it to the contact list.
 */
function createCurrentUserForList(){
    let contact = {
        "name": String(userName),
        "mail": userEmail,
        "phone": " "
    };
    contactList.push(contact);
    console.log('updated contactlist:', contactList);
}


/**
 * Renders the initials of the current user in the contact list.
 */
function renderInitialsOfUser(){
let { profileinitials, secondName } = getInitialsforUser(String(userName));
document.getElementById('contact_list_initals').innerHTML = profileinitials;
document.getElementById('contact_list_initals').classList.add(`letter-${secondName.toLowerCase()}`);
}

/**
 * Renders contacts into their corresponding alphabetical rows within the contact list.
 * If no contacts start with a certain letter, hides the corresponding containers.
 */
function getInitialsforUser(contact) {
    const words = contact.split(" ");
    const firstName = words[0][0];
    const secondName = words[1] ? words[1][0] : '';
    const profileinitials = firstName + secondName;
    return { profileinitials, secondName }; // Rückgabe von profileinitials und secondName als Objekt
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
        let { profileinitials, secondName } = getInitials(contact);
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


/**
 * Retrieves initials for a given contact's name.
 * 
 * @param {string} contact - The name of the contact.
 * @returns {Object} An object containing profile initials and the second name's initial.
 */
function getInitials(contact) {
    const words = contact.name.split(" ");
    const firstName = words[0][0];
    const secondName = words[1] ? words[1][0] : '';
    const profileinitials = firstName + secondName;
    return { profileinitials, secondName };
}


function getInitialsForOverlay() {
    let nameInput = document.getElementById('contactlist_name_input').value;
    let initialsContainer = document.getElementById('contact_initials_container');
    let initials = nameInput.split(' ');
    let firstLetter = initials[0][0];
    let secondLetter = initials[1] ? initials[1][0] : '';
    initialsContainer.classList.add(`letter-${secondLetter.toLowerCase()}`);
    initialsContainer.innerHTML = `${firstLetter + secondLetter}`;
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
    }, 125);
    const addContactOptionsButton = document.getElementById('contactlist_add_contact_options_button');
    if (window.innerWidth < 1210) {
        addContactOptionsButton.style.display = 'flex';
    } else {
        addContactOptionsButton.style.display = 'none';
    }
    document.getElementById('contactlist_add_contact_button').style.display = 'none';
}


/**
 * Adds highlights to the selected contact in the contact list.
 * 
 * @param {number} alphabetIndex - Index of the corresponding alphabetical row.
 * @param {number} contactIndex - Index of the selected contact.
 */
function addHighlightsToContact(alphabetIndex, contactIndex) {
    const allContactContainers = document.querySelectorAll('.contact_list_container');
    allContactContainers.forEach(container => {
        container.classList.remove('selected');
    });
    const selectedContainer = document.getElementById(`contact_${alphabetIndex}_${contactIndex}`);
    selectedContainer.classList.add('selected');
}


/**
 * Opens the edit contact dialog.
 * This function is triggered when the user wants to edit a contact from the contact list.
 * It retrieves the contact details based on the provided indices, shows the add contact dialog,
 * and populates it with the details of the selected contact.
 * 
 * @param {number} alphabetIndex - Index of the corresponding alphabetical row.
 * @param {number} contactIndex - Index of the selected contact.
 */
function openEditContact(alphabetIndex, contactIndex) {
    const contact = contactList.filter(contact => contact.name.charAt(0).toUpperCase() === alphabet[alphabetIndex])[contactIndex];
    showAddContactDialog();
    changeAddContactoverlay(contact);
    getInitialsForOverlay();
}


/**
 * Updates a contact after editing.
 * 
 * This function first deletes the contact without asking for confirmation,
 * then adds the edited contact to the contact list,
 * and finally shows a success button indicating that the contact was edited successfully.
 * 
 * Note: This function does not handle user confirmation for deletion or editing.
 * 
 * @returns {Promise<void>} A Promise that resolves once the contact is updated.
 */
async function updateContact() {
    deleteContactWithoutConfirm();
    addToContacts();
    showSuccessButtonEdit();
}


/**
 * Closes the contact overview.
 * 
 * This function sets a timeout to hide the contact overview after 125 milliseconds.
 * It also sets the transform style property to move the contact overview off-screen horizontally.
 * Additionally, it displays the 'Add Contact' button and hides the 'Add Contact Options' button.
 */
function closeContact() {
    setTimeout(() => {
        document.getElementById('contact_overview').style.display = "none";
    }, 125);
    document.getElementById('contact_overview').style.transform = 'translateX(200%)';
    document.getElementById('contactlist_add_contact_button').style.display = 'flex';
    document.getElementById('contactlist_add_contact_options_button').style.display = 'none';
}


/**
 * This function is used to show the add contact overlay by clicking the 'add new contact' button.
 */
function showAddContactDialog() {
    renderContactOverlay();
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


/**
 * Renders the contact overlay for adding or editing contacts.
 * 
 * This function dynamically generates the HTML content for the contact overlay and inserts it into the 'contactlist_overlay_container' element.
 * It includes input fields for entering contact information (name, email, phone), buttons for canceling, saving, and editing contacts, and icons for visual representation.
 * The overlay also includes event listeners for handling user interactions such as closing the overlay, submitting the form, and updating the initials display.
 */
function renderContactOverlay() {
    document.getElementById('contactlist_overlay_container').innerHTML = `
    <div class="contactlist_mid_layer">
            <div onclick="noClose(event)" id="add_contact_overlay">
                <div class="left_side_add_contact_overlay">
                    <div class="add_contact_close_container_handy">
                        <img onclick="closeAddContactDialog()"
                            src="./assets/contactbook/icons_contactbook/close_white.svg" alt="">
                    </div>
                    <img id="contact_list_logo_handy" src="./assets/contactbook/img_contactbook/join_logo.svg" alt="">
                    <div class="add_contact_overlay_text_container">
                        <span id="add_contact_headline">Add contact</span>
                        <span id="under_headline">Tasks are better with a team!</span>
                        <img src="./assets/contactbook/icons_contactbook/dividing_bar_blue_horizontal.svg" alt="">
                    </div>
                </div>
                <div class="right_side_add_contact_overlay">
                    <div class="center_up mb50">
                        <div id="contact_initials_container">
                            <img class="hw64" src="./assets/contactbook/icons_contactbook/person_white.svg" alt="">
                        </div>
                    </div>
                    <div class="center_up mb50">
                        <div class="edit_formular_container">
                            <div class="add_contact_close_container">
                                <img onclick="closeAddContactDialog()"
                                    src="./assets/contactbook/icons_contactbook/close.svg" alt="">
                            </div>
                            <form onsubmit="handleSubmit(); return false;">
                                <div class="input_container">
                                    <input onkeyup="getInitialsForOverlay()" required type="text" placeholder="Name" id="contactlist_name_input"
                                        title="Please enter a name with at least 2 characters, a space, and the last name with at least 3 characters"
                                        pattern="[a-zA-Z]{2,}\\s[a-zA-Z]{3,}">
                                    <img src="./assets/contactbook/icons_contactbook/person.svg" alt="">
                                </div>
                                <div class="input_container">
                                    <input required type="email" placeholder="E-Mail" id="contactlist_mail_input"
                                        title="Please enter a valid email address">
                                    <img src="./assets/contactbook/icons_contactbook/mail.svg" alt="">
                                </div>
                                <div class="input_container">
                                    <input required type="text" placeholder="Phone" id="contactlist_phone_input"
                                        pattern="\\+[0-9]{2} [0-9]{3} [0-9]{3} [0-9]{3} [0-9]{2}"
                                        title="Please enter a valid phone number in the format +49 333 333 333 33">
                                    <img src="./assets/contactbook/icons_contactbook/call.svg" alt="">
                                </div>
                                <div class="edit_contact_button_container">
                                    <button type="button" id="contact_cancel_button" onclick="resetAddContactForm();">
                                        Cancel ✖
                                    </button>
                                    <button id="contact_save_button">
                                        Create contact <img src="./assets/contactbook/icons_contactbook/check.svg"
                                            alt="">
                                    </button>
                                    <button id="contact_edit_button" class="center">
                                        Save <img src="./assets/contactbook/icons_contactbook/check.svg" alt="">
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}


/**
 * Displays the add contact dialog in low resolution.
 * 
 * This function renders the contact overlay for adding or editing contacts using the 'renderContactOverlay' function.
 * It sets the display style of the 'contactlist_overlay_container' element to 'unset' to make the overlay visible.
 * Additionally, it animates the 'add_contact_overlay' element by setting its transform style to 'translateY(0%)' after a delay of 100 milliseconds.
 */
function showAddContactDialogLowRes() {
    renderContactOverlay();
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
    document.getElementById('contact_cancel_button').innerHTML = 'Cancel ✖';
    closeAddContactOptionsLowRes();
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
    closeAddContactDialog();
    renderContactList();
    findAlphabetIndex(contact);
    saveContactButton.disabled = false;
}


/**
 * Finds the alphabet index and contact index for a given contact in the contact list.
 * 
 * This function takes a contact object as input and extracts the first letter of the contact's name to determine its alphabetical index.
 * It then finds the corresponding alphabetical row in the contact list using the 'alphabet' array and returns the index.
 * Additionally, it finds the index of the contact within the filtered list of contacts starting with the same letter and renders detailed information about the contact using the 'renderContact' function.
 * 
 * @param {Object} contact - The contact object for which to find the alphabet index and contact index.
 */
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
function resetAddContactForm() {
    document.getElementById('contactlist_name_input').value = '';
    document.getElementById('contactlist_mail_input').value = '';
    document.getElementById('contactlist_phone_input').value = '';
}


async function deleteContactWithoutConfirm() {
    const contactName = document.getElementById('contact_overview_name').innerText.trim();
    const contactMail = document.getElementById('contact_overview_mail').innerText.trim();
    const indexToDelete = contactList.findIndex(contact => contact.name === contactName && contact.mail === contactMail);
    if (indexToDelete !== -1) {
        contactList.splice(indexToDelete, 1);
        console.log('Contact deleted successfully.');
    }
    await setItem('contactList', JSON.stringify(contactList));
    renderContactList();
    document.getElementById('contact_overview').style.transform = 'translateX(200%)';
}


/**
 * Deletes a contact from the contact list without confirmation.
 * 
 * This function retrieves the name and email of the contact to be deleted from the contact overview section.
 * It then finds the index of the contact to be deleted in the contact list based on its name and email.
 * If the contact is found (index is not -1), it is removed from the contact list.
 * The updated contact list is then stored in the backend storage.
 * Finally, it renders the updated contact list and hides the contact overview section.
 */
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
    showSuccessButtonDelete();
}


/**
 * Handles the form submission for adding or editing a contact.
 * Disables the form buttons during submission to prevent multiple submissions.
 * Depending on the button clicked (Save or Edit), it either adds a new contact or updates an existing contact.
 * Enables the form buttons after submission.
 * 
 * @param {Event} event - The form submission event.
 * @returns {Promise<void>} A Promise that resolves after adding or updating the contact.
 */
async function handleSubmit() {
    const cancelButton = document.getElementById("contact_cancel_button");
    const saveButton = document.getElementById("contact_save_button");
    const editButton = document.getElementById("contact_edit_button");
    cancelButton.disabled = true;
    saveButton.disabled = true;
    editButton.disabled = true;
    if (event.submitter === saveButton) {
        await addToContacts();
        showSuccessButton();
    } else if (event.submitter === editButton) {
        await updateContact();
        showSuccessButtonEdit();
    }
    cancelButton.disabled = false;
    saveButton.disabled = false;
    editButton.disabled = false;
}


function showSuccessButton() {
    let successButton = document.getElementById('create_contact_success_button');
    if (window.innerWidth > 1210) {
        successButton.style.display = 'flex';
        successButton.style.bottom = '110px';
        successButton.style.right = '346px';
    } else {
        successButton.style.display = 'flex';
        successButton.style.bottom = '96px';
        successButton.style.right = '148px';
    }
    setTimeout(() => {
        successButton.style.transform = 'translateY(0%)';
    }, 125);
    setTimeout(() => {
        successButton.style.display = 'none';
    }, 1000);
    successButton.style.transform = 'translateY(400%)';
}


/**
 * Displays the success button after adding a new contact.
 * The button appears temporarily and then fades out.
 */
function showSuccessButtonEdit() {
    let successButton = document.getElementById('edit_contact_success_button');
    if (window.innerWidth > 1210) {
        successButton.style.display = 'flex';
        successButton.style.bottom = '110px';
        successButton.style.right = '346px';
    } else {
        successButton.style.display = 'flex';
        successButton.style.bottom = '96px';
        successButton.style.right = '148px';
    }
    setTimeout(() => {
        successButton.style.transform = 'translateY(0%)';
    }, 125);
    setTimeout(() => {
        successButton.style.display = 'none';
    }, 1000);
    successButton.style.transform = 'translateY(400%)';
}


/**
 * Displays the success button after deleting a contact.
 * The button appears temporarily and then fades out.
 */
function showSuccessButtonDelete() {
    let successButton = document.getElementById('delete_contact_success_button');
    if (window.innerWidth > 1210) {
        successButton.style.display = 'flex';
        successButton.style.bottom = '110px';
        successButton.style.right = '346px';
    } else {
        successButton.style.display = 'flex';
        successButton.style.bottom = '96px';
        successButton.style.right = '148px';
    }
    setTimeout(() => {
        successButton.style.transform = 'translateY(0%)';
    }, 125);
    setTimeout(() => {
        successButton.style.display = 'none';
    }, 1000);
    successButton.style.transform = 'translateY(400%)';
}


/**
 * Asynchronously opens the edit contact dialog in low-resolution screens.
 * Retrieves the contact information from the contact overview, displays the add contact dialog,
 * populates it with the contact information, and retrieves the initials for the overlay.
 */
async function openEditContactLowRes() {
    const contactName = document.getElementById('contact_overview_name').innerText.trim();
    const contactMail = document.getElementById('contact_overview_mail').innerText.trim();
    const contact = contactList.find(contact => contact.name === contactName && contact.mail === contactMail);
    if (!contact) {
        console.error('Contact not found.');
        return;
    }
    showAddContactDialog();
    changeAddContactoverlay(contact);
    getInitialsForOverlay();
}


/**
 * Updates the add contact dialog to display contact information for editing.
 * Displays the edit button, hides the under headline, hides the save button,
 * changes the cancel button text to "Delete", updates the headline to "Edit contact",
 * and populates the input fields with the contact's name, email, and phone number.
 * 
 * @param {object} contact - The contact object containing name, mail, and phone properties.
 */
function changeAddContactoverlay(contact) {
    document.getElementById('contact_edit_button').style.display = 'flex';
    document.getElementById('under_headline').style.display = 'none';
    document.getElementById('contact_save_button').style.display = 'none';
    document.getElementById('contact_cancel_button').innerHTML = 'Delete';
    document.getElementById('add_contact_headline').innerHTML = 'Edit contact';
    document.getElementById('contactlist_name_input').value = contact.name;
    document.getElementById('contactlist_mail_input').value = contact.mail;
    document.getElementById('contactlist_phone_input').value = contact.phone;
}


/**
 * Displays the add contact options dropdown menu in low-resolution mode.
 * Shows the dropdown overlay and animates the dropdown options into view.
 */
function showAddContactOptionsLowRes() {
    document.getElementById('dropdown_overlay').style.display = 'flex';
    setTimeout(() => {
        document.getElementById('dropdown_options').style.transform = 'translateX(0%)';
    }, 125);
}


/**
 * Closes the add contact options dropdown menu in low-resolution mode.
 * Animates the dropdown options out of view and hides the dropdown overlay.
 */
function closeAddContactOptionsLowRes() {
    document.getElementById('dropdown_options').style.transform = 'translateX(120%)';
    setTimeout(() => {
        document.getElementById('dropdown_overlay').style.display = 'none';
    }, 125);
}