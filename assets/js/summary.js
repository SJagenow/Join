


function getCurrentUser() {
    let userName = JSON.parse(localStorage.getItem("currentUserName"));
    document.getElementById('summary-userName').innerHTML = userName;
}