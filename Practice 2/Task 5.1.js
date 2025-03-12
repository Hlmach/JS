"use strict";

function createSurvey() {
    let name = prompt("Введіть своє ім'я:");
    let age = Number(prompt("Введіть свій вік:"));
    let city = prompt("Введіть ваше місто:");
    let isAdult = age >= 18 ? "Повнолітній" : "Неповнолітній";
    return { name, age, city, isAdult };
}

function displaySurvey(data) {
    console.log(`Анкета: 
        Ім'я: ${data.name}
        Вік: ${data.age}
        Місто: ${data.city}
        Вікова категорія: ${data.isAdult}
    `);
    alert(`Анкета:
        Ім'я: ${data.name}
        Вік: ${data.age}
        Місто: ${data.city}
        Вікова категорія: ${data.isAdult}`);
}

let surveyData = createSurvey();
displaySurvey(surveyData);