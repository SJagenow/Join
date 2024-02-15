

function initSummary() {
    getCurrentUser();
    updateGreeting();

}
function getCurrentUser() {
    let userName = JSON.parse(localStorage.getItem("currentUserName"));
    let summaryUserName = document.getElementById('summary-userName');
    console.log(userName);

    if (userName) {
        summaryUserName.textContent = userName;
      } else {
        summaryUserName.textContentt = "Guest";
      } 
}




function updateGreeting() {
    let greetingTime = document.getElementById("greet");
    let currentDate = new Date();
    let currentHour = currentDate.getHours();
  
    if (currentHour >= 5 && currentHour < 12) {
      greetingTime.textContent = "Good Morning,";
    } else if (currentHour >= 12 && currentHour < 18) {
      greetingTime.textContent = "Good Afternoon,";
    } else {
      greetingTime.textContent = "Good Evening,";
    }
  }