// import { users } from './signUp.js';
let currentUser = [];
let currentUserName = [];
let currentUserEmail = [];
let  contactlist = []; // braucht man das?

async function init() {                             // Die Funktion init() wird verwendet, um die Anwendung zu initialisieren, indem sie Benutzerdaten aus dem lokalen Speicher abruft und in das Array "users" einfügt.
    let userData = await getItem("users");      // Benutzerdaten aus dem lokalen Speicher abrufen
                                              // Überprüfen, ob Benutzerdaten vorhanden sind
                                              // Wenn Daten vorhanden sind, werden sie als JSON-Parsen und in das Array "users" einfügen
                                              // Wenn keine Daten vorhanden sind, wird ein leeres Array als Standardwert verwendet
    users = JSON.parse(userData) || [];
                                               // Jetzt sind die Benutzerdaten initialisiert und können in der Anwendung verwendet werden.
    await loadUsers();
    // autoFillLoginForm();
    checkLoginStatus()
}

async function loadUsers() {
    try {                                               // Attempt to parse the JSON data retrieved from the backend storage using 'getItem'
       users = JSON.parse(await getItem('users'));
    } catch (e) {
       console.error('Loading error:', e);   // If an error occurs during parsing or retrieval, log the error to the console
    }
}

function btnGuestLog(){
    localStorage.clear();
    window.location.href = "../summary.html";
    // document.getElementById('summary-userName').textContentt = `Guest`;
  }

  function checkLoginStatus() {
    const urlParams = new URLSearchParams(window.location.search);      // Die URL-Parameter analysieren, um die Nachricht abzurufen
    const msg = urlParams.get('msg');
    if (msg === "Du hast dich erfolgreich ausgeloggt!") {     // Überprüfen, ob die Nachricht besagt, dass der Benutzer erfolgreich ausgeloggt wurde
      } 
      else {                                            // Wenn ja, geschieht nichts (keine Aktion erforderlich)                                        
        autoFillLoginForm();                                      // Wenn nicht, rufe die Funktion savedLogin() auf, um den Benutzer automatisch anzumelden (falls vorhanden)
    }
}

function autoFillLoginForm() {
  let currentUserData = localStorage.getItem("currentUser"); // Anmeldeinformationen des aktuellen Benutzers aus dem lokalen Speicher abrufen
  let emailInputField = document.getElementById('email'); // E-Mail-Eingabefeld im Anmeldeformular abrufen
  let passwordInputField = document.getElementById('password'); // Passwort-Eingabefeld im Anmeldeformular abrufen

  if (currentUserData) {
      let currentUser = JSON.parse(currentUserData); // Anmeldeinformationen des aktuellen Benutzers aus dem lokalen Speicher parsen
      emailInputField.value = currentUser.email; // E-Mail-Eingabefeld mit der E-Mail-Adresse des Benutzers füllen
      passwordInputField.value = currentUser.password; // Passwort-Eingabefeld mit dem Passwort des Benutzers füllen
      logIn(); // Benutzer automatisch anmelden
  }
}

 function logIn(event) {    // Die Funktion logIn() wird aufgerufen, wenn der Benutzer versucht, sich anzumelden. Sie verhindert das Standardverhalten des Formulars (Neuladen der Seite).
      event.preventDefault();
      console.log('event');
    let emailInput = document.getElementById("email");      // Eingabe der E-Mail-Adresse und des Passworts aus den entsprechenden HTML-Elementen des Anmeldeformulars.
    let passwordInput = document.getElementById("passwordInput");
     let user = users.find(function(u) {                 // Suchen eines Benutzers mit der eingegebenen E-Mail-Adresse und dem eingegebenen Passwort in der Benutzerliste.
        return u.email === emailInput.value && u.password === passwordInput.value;
      });
    if (user) { 
      storeUserData(user);
      console.log('1 User gefunden');                                          // Wenn ein Benutzer mit den eingegebenen Daten gefunden wurde:
       window.location.href = "../summary.html";         // Weiterleiten des Benutzers zur Zusammenfassungsseite.
       
      //  getCurrentUser();                                // Abrufen und Verarbeiten der Daten des angemeldeten Benutzers (z.B. Anzeige des Benutzernamens).
       console.log('2 muss weitergeleitet werden');
      } else {                                              // Wenn kein Benutzer mit den eingegebenen Daten gefunden wurde:
        showUserPasswordMismatch();                                   // Durchführung einer visuellen Rückmeldung für ungültige Anmeldeinformationen (z.B. Schütteln des Eingabefelds).
        console.log('3 else');
      }
  }

function storeUserData(user) {          // speichert die Benutzerdaten im lokalen Speicher abhängig davon, ob die Option "Remember Me" aktiviert ist.
  let userEmail = user.email; // E-Mail-Adresse des Benutzers extrahieren
  let userPassword = user.password; // Passwort des Benutzers extrahieren
  let username = user.name; // Benutzername extrahieren

  currentUserName.push(username); // Benutzername zum Array currentUserName hinzufügen
  currentUserEmail.push(userEmail);
  saveDataToLocalStorage("currentUserName", currentUserName); // Benutzernamen im lokalen Speicher speichern
  saveDataToLocalStorage("currentUserEmail", userEmail);

  if (document.getElementById('rememberMe').checked == true) {
      currentUser.push({ email: userEmail, password: userPassword }); // E-Mail und Passwort zum Array currentUser hinzufügen, falls "Remember Me" aktiviert ist
      saveDataToLocalStorage("currentUser", currentUser); // E-Mail und Passwort im lokalen Speicher speichern, falls "Remember Me" aktiviert ist
  }
}

function saveDataToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data)); // Daten im lokalen Speicher unter dem angegebenen Schlüssel speichern
}

function changePasswordInputIcon() {
  let icon = document.querySelector(".passwordIcon");
  let passwordInput = document.getElementById("passwordInput");

  passwordInput.addEventListener("blur", function () {
    if (passwordInput.value.trim() === "") {
      icon.src = "./assets/img/password_input.svg";
    }
  });
  passwordInput.addEventListener("input", function () {
    if (passwordInput.value.trim() === "") {
      passwordInput.type = "password";
      icon.src = "./assets/img/password_input.svg";
    } else {
      if (
        passwordInput.type === "text" &&
        !icon.src.includes("visibility.svg")
      ) {
        icon.src = "./assets/img/visibility.png";
      } else if (
        passwordInput.type === "password" &&
        !icon.src.includes("visibility_off.png")
      ) {
        icon.src = "./assets/img/visibility_off.png";
      }
    }
  });
}

function togglePasswordInputType() {
  let icon = document.querySelector(".passwordIcon");
  let passwordInput = document.getElementById("passwordInput");

  if (passwordInput.type === "password") {
    icon.src = "./assets/img/visibility.png";
    passwordInput.type = "text";
  } else {
    icon.src = "./assets/img/visibility_off.png";
    passwordInput.type = "password";
  }
}

function showUserPasswordMismatch() {
  let passwordInput = document.getElementById("passwordInput");
  let passwordInvalidDiv = document.querySelector(".passwordInvalidDiv");
  passwordInvalidDiv.textContent = "Incorrect Email adress or password.";
  passwordInvalidDiv.classList.remove("hidden");
  passwordInput.classList.add("alert");

  let emailInput = document.getElementById("email");
  let emailInvalidDiv = document.querySelector(".emailInvalid");
  emailInvalidDiv.textContent = "Incorrect Email adress or password.";
  emailInvalidDiv.classList.remove("hiden");
  emailInput.classList.add("alert");
}

// document.addEventListener("DOMContentLoaded", function () {
//   var overlay = document.querySelector(".overlay");

//   overlay.addEventListener("animationend", function () {
//     overlay.remove();
//   });
// });


// function showPasswordIcon() {
//   let password = document.getElementById('password');
//   let lock = document.getElementById("lock");
//   let eye = document.getElementById('eyeOffImg');

//   if (password.value.length > 0) {
//       console.log('1');
//       lock.classList.add('hidden');
//       eye.classList.remove('hidden');
//   } else {
//     console.log('2');
//       lock.classList.remove('hidden');
//       eye.classList.add('hidden');
//   }
// }

// function showPassword() {
//   let inputfield = document.getElementById('password');
//   let eye = document.getElementById('eyeOffImg');

//   if (inputfield.type == "password") {
    
//     console.log('eye');
//     inputfield.type = "text";
//     eye.src = "./assets/img/visibility.png"; 
     
//   } 
//   else {
//     console.log('closAye');
//     inputfield.type = "password"; 
//     eye.src = "./assets/img/visibility_off.png";
//     eye.classList.remove('hidden'); 
//   }
// }
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

  function checkEmailValidity() {
    const emailInput = document.getElementById("email");
    const emailError = document.querySelector(".emailInvalid");
    const email = emailInput.value.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
    emailError.textContent = isValid ? "" : "Please enter a valid email address!";
    emailError.classList.toggle("hidden", isValid);
    emailInput.classList.toggle("alert", !isValid);
  }

  function checkPasswordValidity() {
    let passwordInput = document.getElementById("passwordInput");
    let passwordInvalidDiv = document.querySelector(".passwordInvalidDiv");
  
    if (passwordInput.value.length < 8 && passwordInput.value.length !== 0) {
      showPasswordLengthInvalid();
    } else {
      passwordInvalidDiv.classList.add("hidden");
      passwordInput.classList.remove("alert");
    }
  }
  