let users = [];

// Exportieren der users-Variable
// export { users };

let newID = 0;

async function initSignUp() {
  users = JSON.parse(await getItem("users")) || [];
  // loadUsers();
  validateSignUpButton();
  // displaySignUpSuccessMessage();
}

function displaySignUpSuccessMessage() {
  let screen = document.getElementById("signUpScreen");
  screen.classList.add("hidden");
  screen.classList.remove("hidden");
}

async function addUser() {
  let name = document.getElementById('names').value;
  let email = document.getElementById('emails').value;
  let password = document.getElementById('passwords').value;

  users.push({ name: name, email: email, password: password });
  await setItem('users', JSON.stringify(users));
  newID += newID + 1;
  console.log(newID);
  //weiterleitung zu Login-Seite
  window.location.href = "./logIn.html";
}

async function validateSignUpButton() {
  let signUpButton = document.getElementById("signUpBtn");
  const isEnabled = isButtonEnabled();

  if (isEnabled) {
    signUpButton.removeAttribute("disabled");
  } else {
    signUpButton.setAttribute("disabled", "disabled");
  }
}

function checkName() {
  let input = document.getElementById("names");
  let invalidDiv = document.getElementById("nameInvalid");
  let isValid = input.value.trim() !== "" && input.validity.valid;

  invalidDiv.textContent = isValid ? "" : "Please enter a valid name!";
  invalidDiv.classList.toggle("hidden", isValid);
  input.classList.toggle("alert", !isValid);
}

function isButtonEnabled() {
  const checkbox = document.getElementById("checkbox");
  const nameField = document.getElementById("names");
  const emailField = document.getElementById("emails");
  const passwordField = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPW");
  const invalidDivs = document.querySelectorAll(".nameInvalid, .emailInvalid, .pwInvalid, .confirmPWInvalid");
  const hasNoErrors = Array.from(invalidDivs).every(div => div.classList.contains("hidden"));
  const hasNoWarning = !document.querySelector(".alert");

  const isEnabled =
    checkbox.src.includes("checkbox-icon-selected.svg") && // suchen
    nameField.value.trim() !== "" &&
    emailField.value.trim() !== "" &&
    passwordField.value.trim() !== "" &&
    confirmPasswordInput.value.trim() !== "" &&
    hasNoErrors &&
    hasNoWarning;

  return isEnabled;
}

function togglePasswordIcon() {
  const icon = document.querySelector(".pwIcon");
  const passwordInput = document.getElementById("password");

  const updateIcon = () => {
    if (passwordInput.value.trim() === "") {
      icon.src = "./assets/img/password_input.svg";
    } else {
      icon.src = passwordInput.type === "text" ? "./assets/img/visibility.png" : "./assets/img/visibility_off.png";
    }
  };
  passwordInput.addEventListener("blur", updateIcon);
  passwordInput.addEventListener("input", updateIcon);
}

function checkPasswordValidity() {
  let passwordInput = document.getElementById("password");
  let confirmPWInput = document.getElementById("confirmPW");

  if (passwordInput.value.length > 0 && confirmPWInput.value.length > 0) {
    if (passwordInput.value === confirmPWInput.value){
    //  &&
    //   passwordInput.value.trim().length >= 4 &&
    //   confirmPWInput.value.trim().length >= 4 &&
    //   passwordInput.value.trim().length === confirmPWInput.value.trim().length
    //   ) {
      validPwLength(passwordInput.value, confirmPWInput.value);
     } else {
      
      hidePasswordMismatchMessage();
      
    }
  } else {
    handlePwMismatch();
  }
}

function handlePwMismatch() {
  let invalidPW = document.querySelector(".pwInvalid");
  let confirmPasswordInvalid = document.querySelector(".confirmPWInvalid");
  let passwordInput = document.getElementById("password");
  let confirmPasswordInput = document.getElementById("confirmPW");

  // invalidPW.textContent = "Ups! your password don’t match";
  confirmPasswordInvalid.textContent = "Ups! your password don’t match";
  invalidPW.classList.remove("hidden");
  confirmPasswordInvalid.classList.remove("hidden");

  passwordInput.classList.add("alert");
  confirmPasswordInput.classList.add("alert");
}

function hidePasswordMismatchMessage() {
  
  let passwordMismatchMessage = document.querySelector(".pwInvalid");     // Verweise auf die entsprechenden HTML-Elemente für die Passwort-Missmatch-Meldungen
  let confirmPasswordMismatchMessage = document.querySelector(".confirmPWInvalid");
  
  passwordMismatchMessage.classList.add("hidden");             // Fügt den Meldungen die Klasse "hidden" hinzu, um sie auszublenden
  confirmPasswordMismatchMessage.classList.add("hidden");
 
}


function validPwLength(passwordValue, confirmPasswordValue) {
  let passwordInvalidDiv = document.querySelector(".pwInvalid");
  let confirmPasswordInvalidDiv = document.querySelector(".confirmPWInvalid");
  let confirmPWInput = document.getElementById('confirmPW');

  if (passwordValue.length < 4) {
    passwordInvalidDiv.textContent =
      "Password must be at least 4 characters long";
    passwordInvalidDiv.classList.remove("hidden");
    passwordInvalidDiv.classList.add("alert");
  } else {
    passwordInvalidDiv.classList.add("hidden");
    passwordInvalidDiv.classList.remove("alert");
  }

  if (confirmPasswordValue.length < 4) {
    confirmPasswordInvalidDiv.textContent =
      "Password must be at least 4 characters long";
    confirmPasswordInvalidDiv.classList.remove("hidden");
    confirmPWInput.classList.add("alert");
  } else {
    confirmPasswordInvalidDiv.classList.add("hidden");
    confirmPWInput.classList.remove("alert");
  }
}

function toggleConfirmPasswordInputIcon() {
  let icon = document.querySelector(".pwInvalid");
  let input = document.getElementById("confirmPW");

  input.addEventListener("blur", function () {
    if (input.value.trim() === "") {
      icon.src = "./assets/img/password_input.svg";
    }
  });

  input.addEventListener("input", function () {
    if (input.value.trim() === "") {
      input.type = "password";
      icon.src = "./assets/img/password_input.svg";
    } else {
      if ( input.type === "text" && !icon.src.includes("visibility.png")
      ) {
        icon.src = "./assets/img/visibility.png";
      } else if ( 
         input.type === "password"   // && !icon.src.includes("visibility_off.png")
      ) {
        icon.src = "./assets/img/visibility_off.png";
      }
    }
  });
}

function checkEmail() {
  const emailInput = document.getElementById("emails");
  const emailError = document.querySelector(".emailInvalid");
  const email = emailInput.value.trim();
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  emailError.textContent = isValid ? "" : "Please enter a valid email address!";
  emailError.classList.toggle("hidden", isValid);
  emailInput.classList.toggle("alert", !isValid);
}