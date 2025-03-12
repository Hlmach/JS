"use strict";

function createConverter(multiplier, offset) {
    return function(temp) {
        return temp * multiplier + offset;
    };
}

const cToF = createConverter(9 / 5, 32);
const fToC = createConverter(5 / 9, -32 * (5 / 9));

let inputTemp = Number(prompt("Введіть значення температури:"));
let direction = prompt("Введіть напрямок конвертації: 'C to F' або 'F to C':").toLowerCase();

let result;
if (direction === "c to f") {
    result = cToF(inputTemp);
} else if (direction === "f to c") {
    result = fToC(inputTemp);
} else {
    alert("Невірний напрямок конвертації!");
    console.error("Invalid direction");
}

if (result !== undefined) {
    alert(`Конвертована температура: ${result.toFixed(2)}`);
    console.log(`Вхідна температура: ${inputTemp}`);
    console.log(`Напрямок конвертації: ${direction}`);
    console.log(`Конвертована температура: ${result.toFixed(2)}`);
}
