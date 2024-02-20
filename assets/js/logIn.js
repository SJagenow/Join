let currentUser = [];
let currentUserName = [];
let currentUserEmail = [];
let  contactlist = []; 


async function init() {                             
    let userData = await getItem("users");      
    users = JSON.parse(userData) || [];
    checkLoginStatus()
}


async function loadUsers() {
    try {                                               
       users = JSON.parse(await getItem('users'));
    } catch (e) {
       console.error('Loading error:', e);   
    }
}


function btnGuestLog(){
    localStorage.clear();
    window.location.href = "../summary.html";
  }


function checkLoginStatus() {
    const urlParams = new URLSearchParams(window.location.search);      
    const msg = urlParams.get('msg');
    if (msg === "Du hast dich erfolgreich ausgeloggt!") {     
      } 
      else {                                                                                   
        autoFillLoginForm();                                      
    }
}


function autoFillLoginForm() {
  let currentUserData = localStorage.getItem("currentUser"); 
  let emailInputField = document.getElementById('email'); 
  let passwordInputField = document.getElementById('password'); 

  if (currentUserData) {
      let currentUser = JSON.parse(currentUserData); 
      emailInputField.value = currentUser.email; 
      passwordInputField.value = currentUser.password; 
      logIn(); 
}
}


function logIn(event) {    
      event.preventDefault();
      console.log('event');
    let emailInput = document.getElementById("email");      
    let passwordInput = document.getElementById("passwordInput");
     let user = users.find(function(u) {                 
        return u.email === emailInput.value && u.password === passwordInput.value;
      });
    if (user) { 
      storeUserData(user);
      console.log('1 User gefunden');                                          
       window.location.href = "../summary.html";         
       
                                      
       console.log('2 muss weitergeleitet werden');
      } else {                                              
        showUserPasswordMismatch();                                   
        console.log('3 else');
      }
  }


function storeUserData(user) {          
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
