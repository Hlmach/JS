"use strict";

console.log("Підключено JavaScript для Практичної роботи №5");

document.getElementById("loadUsers").addEventListener("click", loadUsers);

async function loadUsers() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    
    if (!response.ok) {
      throw new Error(`HTTP помилка! Статус: ${response.status}`);
    }

    const users = await response.json();
    displayUsers(users);
  } catch (error) {
    console.error("Помилка при отриманні даних:", error);
    alert("Не вдалося отримати дані. Спробуйте ще раз.");
  }
}

function displayUsers(users) {
  const userList = document.getElementById("userList");
  userList.innerHTML = ""; 

  users.forEach(user => {
    const li = document.createElement("li");
    li.textContent = `${user.name} (${user.email})`;
    userList.appendChild(li);
  });
}
