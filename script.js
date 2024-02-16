async function init() {
    await includeHTML();
    await highlightMenuLink();
    getCurrentUser();
}

async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

async function getCurrentUser() {
    let userName = JSON.parse(localStorage.getItem("currentUserName"));
    let userEmail = JSON.parse(localStorage.getItem("currentUserEmail"));
    console.log(userName);
    let { profileinitials } = getInitialsforHeader(userName);
    document.getElementById('header_initials').innerHTML = `${profileinitials.toUpperCase()}`;
  }
  
  function getInitialsforHeader(contact) {
    const contactString = String(contact); // Konvertierung des Inputs zu einem String
    const words = contactString.split(" ");
    const firstName = words[0][0];
    const secondName = words[1] ? words[1][0] : '';
    const profileinitials = firstName + secondName;
    return { profileinitials}; // Rückgabe von profileinitials und secondName als Objekt
  }
  

 async function highlightMenuLink(){
    let currentPage = window.location.pathname;
    if (currentPage === '/summary.html'){
        document.getElementById('summary_menu_link_container').style.backgroundColor = '#091931'
        document.getElementById('summary_menu_link_container').querySelector('a').style.color = 'white'
        document.getElementById('menu_icon_summary').src = './assets/img/summary_white.png'
    } else if (currentPage === '/add_task.html'){
        document.getElementById('addtask_menu_link_container').style.backgroundColor = '#091931'
        document.getElementById('addtask_menu_link_container').querySelector('a').style.color = 'white'
        document.getElementById('menu_icon_addtask').src = './assets/img/add_task_white.png'
    } else if (currentPage === '/board.html'){
        document.getElementById('board_menu_link_container').style.backgroundColor = '#091931'
        document.getElementById('board_menu_link_container').querySelector('a').style.color = 'white'
        document.getElementById('menu_icon_board').src = './assets/img/Board_white.png'
    }else if (currentPage === '/contacts.html'){
        document.getElementById('contacts_menu_link_container').style.backgroundColor = '#091931'
        document.getElementById('contacts_menu_link_container').querySelector('a').style.color = 'white';
        document.getElementById('menu_icon_contacts').src = './assets/img/contacts_white.png'
    } else if (currentPage === '/privacy_policy.html'){
        document.getElementById('privacy_policy_menulink').style.color = 'white';
    } else if (currentPage === '/legal_notice.html'){
        document.getElementById('legal_notice_menulink').style.color = 'white';
    }
}

function toggleDropDown() {
    let dropdownElement = document.getElementById('dropdown-links').classList;

    if (dropdownElement.contains('d-none')) {
        dropdownElement.remove('d-none');
    } else {
        dropdownElement.add('d-none');
    }
}

// function logOut() {
//     window.location.href = `index.html?msg=Du hast dich erfolgreich ausgeloggt!`;
// }

function changeColor(clickedLink) {
    var links = document.querySelectorAll('.mobile-menu_link_container');

    // Setze die Hintergrundfarbe aller Links zurück
    links.forEach(function (resetLink) {
        resetLink.style.backgroundColor = '#2A3647';
    });

    // Setze die Hintergrundfarbe des geklickten Links
    clickedLink.style.backgroundColor = '#091931';
}

// Aktualisiere die Farbe basierend auf der aktuellen Seite
function updateColorOnLoad() {
    var currentPath = window.location.pathname;
    var links = document.querySelectorAll('.mobile-menu_link_container');

    links.forEach(function (link) {
        if (link.getAttribute('href') === currentPath) {
            changeColor(link);
        }
    });
}

// Rufe die Funktion bei Seitenaufruf auf
window.onload = updateColorOnLoad;


function goBack() {
    window.history.back();
  }