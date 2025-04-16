"use strict";

export function greet(name) {
  console.log(`Привіт, ${name}!`);
}

export const add = (a, b) => a + b;

export const multiply = (a, b) => a * b;

export function sumAll(...nums) {
  return nums.reduce((acc, num) => acc + num, 0);
}
