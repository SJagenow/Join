async function init() {
    await includeHTML();
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

function toggleDropDown() {
    let dropdownElement = document.getElementById('dropdown-links').classList;

    if (dropdownElement.contains('d-none')) {
        dropdownElement.remove('d-none');
    } else {
        dropdownElement.add('d-none');
    }
}

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

