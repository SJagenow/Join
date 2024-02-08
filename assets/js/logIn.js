async function init() {
    // Die Funktion init() wird verwendet, um die Anwendung zu initialisieren, indem sie Benutzerdaten aus dem lokalen Speicher abruft und in das Array "users" einfügt.
    // Benutzerdaten aus dem lokalen Speicher abrufen
    let userData = await getItem("users");
    // Überprüfen, ob Benutzerdaten vorhanden sind
    // Wenn Daten vorhanden sind, werden sie als JSON-Parsen und in das Array "users" einfügen
    // Wenn keine Daten vorhanden sind, wird ein leeres Array als Standardwert verwendet
    users = JSON.parse(userData) || [];
    // Jetzt sind die Benutzerdaten initialisiert und können in der Anwendung verwendet werden.
    await loadUsers();
}

async function loadUsers() {
    try {
        // Attempt to parse the JSON data retrieved from the backend storage using 'getItem'
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        // If an error occurs during parsing or retrieval, log the error to the console
        console.error('Loading error:', e);
    }
}

function btnGuestLog(){
    window.location.href = `summary.html`;
    // greetGuest()
  }

 function logIn(event) {
    // Die Funktion logIn() wird aufgerufen, wenn der Benutzer versucht, sich anzumelden. Sie verhindert das Standardverhalten des Formulars (Neuladen der Seite).
    event.preventDefault();
    // Eingabe der E-Mail-Adresse und des Passworts aus den entsprechenden HTML-Elementen des Anmeldeformulars.
    let emailInput = document.getElementById("email");
    let passwordInput = document.getElementById("password");
    // Suchen eines Benutzers mit der eingegebenen E-Mail-Adresse und dem eingegebenen Passwort in der Benutzerliste.
    let user = users.find(function(u) {
        return u.email === emailInput.value && u.password === passwordInput.value;
      });
  
    // Wenn ein Benutzer mit den eingegebenen Daten gefunden wurde:
    if (user) {
      // Weiterleiten des Benutzers zur Zusammenfassungsseite.
      window.location.href = "../../summary.html";

      // Abrufen und Verarbeiten der Daten des angemeldeten Benutzers (z.B. Anzeige des Benutzernamens).
      getCurrentUser();
    } else {
      // Wenn kein Benutzer mit den eingegebenen Daten gefunden wurde:
      // Durchführung einer visuellen Rückmeldung für ungültige Anmeldeinformationen (z.B. Schütteln des Eingabefelds).
    //   moveElement();
    }
  }
/*
  function moveElement() {
    let mailShake = document.getElementById("moveEmail");
    let passwordShake = document.getElementById("passwordShake");
    let position = 0;
    let speed = 5; // Geschwindigkeit der Animation in Pixel pro Schritt
    
    // Funktion zur Animation des Elements
    function animate() {
      // Bewege das Element um einen Schritt
      position += speed;
      mailShake.style.left = position + "px";
      passwordShake.style.left = position + "px";
      
      // Wenn das Element noch nicht die gewünschte Position erreicht hat, führe die nächste Animationsschleife aus
      if (position < 200) { // Ändere die Bedingung entsprechend der gewünschten Endposition
        requestAnimationFrame(animate);
      }
    }
    
    // Starte die Animation
    animate();
  }
  */