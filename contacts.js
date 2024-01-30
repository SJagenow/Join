const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];


function renderContactList() {
    document.getElementById('contact_list').innerHTML = ``;
    document.getElementById('contact_list').innerHTML = `
    <div class="contactlist_button_container">
        <button>Add new contact <img src="./assets/icons/person_add.svg" alt=""></button>
    </div>
    `;
    for (let i = 0; i < alphabet.length; i++) {
        const singleLetter = alphabet[i];
        document.getElementById('contact_list').innerHTML += `
        <div id="contactlist_alphabet_sorting_container">
        ${singleLetter}  
        </div>
        <div class="divide_container">
            <svg xmlns="http://www.w3.org/2000/svg" width="354" height="2" viewBox="0 0 354 2" fill="none">
            <path d="M1 1H353" stroke="#D1D1D1" stroke-linecap="round"/>
            </svg>
        </div>
    
    `;
    }

}