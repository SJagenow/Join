const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

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

function showAddContactDialog(){
    document.getElementById('contactlist_overlay_container').style.display = 'unset';
}

function closeAddContactDialog(){
    document.getElementById('contactlist_overlay_container').style.display = 'none';
}

function noClose(event) {
    event.stopPropagation();
  }