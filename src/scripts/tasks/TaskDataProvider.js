// Author: Travis Milner, Purpose: This module edits the database multiple ways and also renders the new database based on what has been clicked


import {render} from "./TaskList.js"

const eventHub = document.querySelector(".container")
const dispatchStateChangeEvent = () => {
    const taskStateChangeEvent = new CustomEvent("taskStateChanged")
    eventHub.dispatchEvent(taskStateChangeEvent)
}
// This function is responsible for saving the task and adding putting that information in readable format
export const saveTaskList = (newTaskList) => {
    fetch("http://localhost:8088/tasks" , {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newTaskList)
    })
    
    .then(getTasks).then(
        () => {
            const updatedTask = useTasks()
            render(updatedTask)})
}

let tasks = []

// this function is responsible for getting the tasks from the database and putting them into an empty array
export const getTasks = () => {
    return fetch("http://localhost:8088/tasks")
    .then(response => response.json())
    .then (
        task => {
            tasks = task
        }
    )
}
// this function is simply returning a copy of the tasks array
export const useTasks = () => {
    return tasks.slice()
}
// this function is responsible for deleting from the database based on the task id
export const deleteTask = (taskId) => {
    return fetch(`http://localhost:8088/tasks/${taskId}`, {
        method: "DELETE"
    })
    
}

