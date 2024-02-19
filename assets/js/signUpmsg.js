const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get('msg');
let msgBox = document.getElementById("signUpScreen");

if (msg) {
    // msgBox.innerHTML = msg;
    msgBox.classList.remove("hidden");
} else {
    msgBox.classList.add("hidden");
}