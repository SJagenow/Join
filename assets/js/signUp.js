let users = [];

async function init() {
  users = JSON.parse(await getItem("users")) || [];
}

async function addUser() {
  let name = document.getElementById("names").value;
  let email = document.getElementById("emails").value;
  let password = document.getElementById("passwords").value;

  users.push({ name: name, email: email, password: password });
  await setItem("users", JSON.stringify(users));
  window.location.href =
    "../../index.html?msg=Du hast dich erfolgreich registriert";
}
