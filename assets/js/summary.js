let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


function getCurrentUser() {
    let userName = JSON.parse(localStorage.getItem("currentUserName"));
    document.getElementById('summary-userName').innerHTML = userName;
    console.log(userName);
}


function getCurrentDate() {
    let year = new Date().getFullYear();
    let month = new Date().getMonth();
    let day = new Date().getDate();
    let hour = new Date().getHours();
    
    document.getElementById('greet').innerHTML = getGreetings(hour);
    document.getElementById('deadline-date').innerHTML = getFullDate(month, day, year);
    console.log(hour);
}


function getGreetings(hour) {
   console.log(hour);
    if (hour > 5 && hour < 11) return 'Good morning,';
    if (hour > 11 && hour < 18) return 'Good afternoon,';
    else  return 'Good evening,';
    
} 

// 
function getFullDate(month, day, year) {
   console.log(7);
    let m = months[month];
    let d = day;
    let y = year;
    return `${m} ${d}, ${y}`;
}