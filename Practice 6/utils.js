"use strict";

// Функція привітання
export function greet(name) {
  console.log(`Привіт, ${name}!`);
}

// Функція додавання
export const add = (a, b) => a + b;

// Функція множення
export const multiply = (a, b) => a * b;

// Функція суми з rest-оператором
export function sumAll(...nums) {
  return nums.reduce((acc, num) => acc + num, 0);
}
