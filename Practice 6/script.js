"use strict";
import { greet, add, multiply, sumAll } from "./utils.js";
import { user, numbersArray } from "./data.js";

console.log("Модульний код підключено!");

// Використання функцій
greet("Студент");
console.log("10 + 5 =", add(10, 5));
console.log("10 * 5 =", multiply(10, 5));

// Використання шаблонних рядків та деструктуризації
const { name, age, city } = user;
const userInfo = `Користувач: ${name}, Вік: ${age}, Місто: ${city}`;
console.log(userInfo);

// Використання spread оператора
const extendedNumbers = [...numbersArray, 6, 7, 8];
console.log("Розширений масив:", extendedNumbers);

// Функція з rest-оператором
console.log("Сума чисел:", sumAll(1, 2, 3, 4, 5, 6));

// Виведення на сторінку
document.getElementById("app").innerHTML = `<p>${userInfo}</p>`;
