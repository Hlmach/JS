"use strict";
        
const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

addTaskButton.addEventListener("click", function() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const li = document.createElement("li");
        li.textContent = taskText;
        taskList.appendChild(li);
        taskInput.value = "";
        }
        
    });

taskList.addEventListener("mouseover", function(event) {
    if (event.target.tagName === "LI") {
        event.target.remove();
    }
});