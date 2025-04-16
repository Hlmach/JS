"use strict";
import { greet, add, multiply, sumAll } from "./utils.js";
import { user, numbersArray } from "./data.js";

console.log("Модульний код підключено!");

greet("Студент");
console.log("10 + 5 =", add(10, 5));
console.log("10 * 5 =", multiply(10, 5));

const { name, age, city } = user;
const userInfo = `Користувач: ${name}, Вік: ${age}, Місто: ${city}`;
console.log(userInfo);

const extendedNumbers = [...numbersArray, 6, 7, 8];
console.log("Розширений масив:", extendedNumbers);

console.log("Сума чисел:", sumAll(1, 2, 3, 4, 5, 6));

document.getElementById("app").innerHTML = `<p>${userInfo}</p>`;
