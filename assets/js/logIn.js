async function init() {
    // Die Funktion init() wird verwendet, um die Anwendung zu initialisieren, indem sie Benutzerdaten aus dem lokalen Speicher abruft und in das Array "users" einfügt.
    // Benutzerdaten aus dem lokalen Speicher abrufen
    let userData = await getItem("users");
    // Überprüfen, ob Benutzerdaten vorhanden sind
    // Wenn Daten vorhanden sind, werden sie als JSON-Parsen und in das Array "users" einfügen
    // Wenn keine Daten vorhanden sind, wird ein leeres Array als Standardwert verwendet
    users = JSON.parse(userData) || [];
    // Jetzt sind die Benutzerdaten initialisiert und können in der Anwendung verwendet werden.
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
    let user = users.find(function(elem) {
        return elem.email === emailInput.value && elem.password === passwordInput.value;
      });
  
    // Wenn ein Benutzer mit den eingegebenen Daten gefunden wurde:
    if (user) {
      // Weiterleiten des Benutzers zur Zusammenfassungsseite.
      window.location.href = "summary.html";

      // Abrufen und Verarbeiten der Daten des angemeldeten Benutzers (z.B. Anzeige des Benutzernamens).
      getCurrentUser();
    } else {
      // Wenn kein Benutzer mit den eingegebenen Daten gefunden wurde:
      // Durchführung einer visuellen Rückmeldung für ungültige Anmeldeinformationen (z.B. Schütteln des Eingabefelds).
      shakeInput();
    }
  }
  