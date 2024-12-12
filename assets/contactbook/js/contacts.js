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


/**
 * Asynchronously loads the contact list from the backend storage.
 * If successful, updates the global variable 'contactList' with the parsed JSON data.
 * 
 * @param {Array} contactList - This variable receives the parsed JSON data from the backend.
 */
// async function loadContactList() {
//     try {
//         // Attempt to parse the JSON data retrieved from the backend storage using 'getItem'
//         contactList = JSON.parse(await getItem('contactList'));
//     } catch (e) {
//         // If an error occurs during parsing or retrieval, log the error to the console
//         console.error('Loading error:', e);
//     }
// }

async function loadContactList() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/contacts/');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        contactList = await response.json();
        console.log(contactList); 
    } catch (e) {
        console.error('Loading error:', e);
    }
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
    // Gruppiere Kontakte nach ihrem ersten Buchstaben
    const groupedContacts = alphabet.reduce((acc, letter) => {
        acc[letter] = contactList.filter(contact =>
            contact.name && contact.name.charAt(0).toUpperCase() === letter
        );
        return acc;
    }, {});
  
    for (let i = 0; i < alphabet.length; i++) {
        const letter = alphabet[i];
        const contactsStartingWithLetter = groupedContacts[letter] || [];
        
        const namesContainer = document.getElementById(`contact_list_names${i}`);
        const alphabetContainer = document.getElementById(`contactlist_alphabet_sorting_container${i}`);
        const divideContainer = document.getElementById(`divide_container_${i}`);

       
        if (!namesContainer || !alphabetContainer || !divideContainer) {
            console.warn(`Container für Buchstabe ${letter} nicht gefunden.`);
            continue;
        }

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
 * Opens the edit contact dialog.
 * This function is triggered when the user wants to edit a contact from the contact list.
 * It retrieves the contact details based on the provided indices, shows the add contact dialog,
 * and populates it with the details of the selected contact.
 * 
 * @param {number} alphabetIndex - Index of the corresponding alphabetical row.
 * @param {number} contactIndex - Index of the selected contact.
 */
async function openEditContact(alphabetIndex, contactIndex) {
    const alphabetLetter = alphabet[alphabetIndex];
    console.log("Alphabet Letter:", alphabetLetter);

    const contactsForLetter = contactList.filter(contact => 
        contact.name && contact.name.charAt(0).toUpperCase() === alphabetLetter
    );
    console.log("Contacts for Letter:", contactsForLetter);

    const selectedContact = contactsForLetter[contactIndex];
    console.log("Selected Contact:", selectedContact);

    if (!selectedContact) {
        console.error('Kontakt nicht gefunden:', alphabetLetter, contactIndex);
        alert("Kontakt konnte nicht gefunden werden.");
        return; 
    }

    showAddContactDialog();
    changeAddContactoverlay(selectedContact);

    document.getElementById('contact_save_button').onclick = async function () {
        const contactId = selectedContact.id; 
        console.log("Contact ID:", contactId);

        const updatedContact = {
            name: document.getElementById('contactlist_name_input').value.trim(),
            mail: document.getElementById('contactlist_mail_input').value.trim(),
            phone: document.getElementById('contactlist_phone_input').value.trim(),
        };

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/contacts/${contactId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedContact),
            });

            if (!response.ok) {
                throw new Error('Fehler beim Aktualisieren des Kontakts');
            }

            const savedContact = await response.json();
            console.log("Saved Contact:", savedContact);

            // Kontakt in der Liste ersetzen (anstatt einen neuen hinzuzufügen)
            contactList = contactList.map(contact =>
                contact.id === contactId ? savedContact : contact
            );

            // Die Kontaktliste neu rendern
            renderContactsToList();
            closeAddContactDialog();
            showSuccessButtonEdit();

        } catch (error) {
            console.error('Fehler beim Bearbeiten des Kontakts:', error);
            alert('Es gab ein Problem beim Bearbeiten des Kontakts.');
        }
    };
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
 */let contactId = contact.id;
async function updateContact(contactId) {

    
    await deleteContact(contactId);
    addToContacts();
    showSuccessButtonEdit();
}



/**
 * This function creates a json from the inputs of the 'add contact' overlay and pushes it into the contactlist Array and saves it in the backend.
 * 
 * @param {string} contact - This is the json with all informations from the inputfield. It will be pushed into contactlist.
 */
async function addToContacts() {
    let saveContactButton = document.getElementById('contact_save_button');
    saveContactButton.disabled = true;

    let name = document.getElementById('contactlist_name_input').value.trim();
    let mail = document.getElementById('contactlist_mail_input').value.trim();
    let phone = document.getElementById('contactlist_phone_input').value.trim();

    if (!name || !mail || !phone) {
        alert('Bitte fülle alle Felder aus.');
        saveContactButton.disabled = false;
        return;
    }

    let contact = {
        name: name,
        mail: mail,
        phone: phone,
    };

    try {
        saveContactButton.innerText = 'Speichern...';

        const response = await fetch('http://127.0.0.1:8000/api/contacts/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contact),
        });

        if (!response.ok) {
            if (response.status === 400) {
                const errorData = await response.json();
                alert(`Fehler: ${errorData.message || 'Ungültige Eingaben'}`);
            } else {
                alert('Serverfehler beim Hinzufügen des Kontakts.');
            }
            throw new Error(`HTTP Fehler: ${response.status}`);
        }

        const newContact = await response.json();
        contactList.push(newContact); 
        
        renderContactsToList(); 
        resetAddContactForm();   
        closeAddContactDialog(); 
    } catch (error) {
        console.error('Fehler:', error);
        alert('Es gab einen Fehler beim Hinzufügen des Kontakts.');
    } finally {
        saveContactButton.disabled = false;
        saveContactButton.innerText = 'Speichern';
    }
}

function resetAddContactForm() {
    document.getElementById('contactlist_name_input').value = '';
    document.getElementById('contactlist_mail_input').value = '';
    document.getElementById('contactlist_phone_input').value = '';
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

/**
 * Deletes a contact from the 'contactList' array.
 * Prompts the user for confirmation before deleting.
 * After deletion, updates the 'contactList' item in the storage and re-renders the contact list.
 * Displays a success button for deleting the contact.
 */
/**
 * Deletes a contact using the provided ID and updates the UI.
 * 
 * @param {number} contactId - The ID of the contact to delete.
 */

// Funktion zum Bestätigen des Löschvorgangs
async function confirmDeleteContact(contactId) {
    const confirmDelete = confirm('Are you sure you want to delete this contact?');
    if (confirmDelete) {
        await deleteContact(contactId); 
    } else {
        console.log('Kontakt löschen abgebrochen.');
    }
}

async function deleteContact(contactId) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/contacts/${contactId}/`, { 
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete the contact');
        }

        // Entferne den Kontakt aus der Liste
        contactList = contactList.filter(contact => contact.id !== contactId);

        // Rende die Kontaktliste neu
        renderContactsToList();
        console.log(`Kontakt mit ID ${contactId} erfolgreich gelöscht.`);
    } catch (error) {
        console.error('Fehler beim Löschen:', error);
        alert('Es gab ein Problem beim Löschen des Kontakts.');
    }
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