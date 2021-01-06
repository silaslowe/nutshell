// Author: Travis Milner, Purpose: This module is responsible for rendering a form and looking for a submit click that save thats forms value. 


import { RenderCreateArea } from "../home/HomePage.js"
import { saveTaskList } from "./TaskDataProvider.js"

const eventHub = document.querySelector(".container")
// this function is simply the html for the form to create a task
export const TaskHtml = () => {
    const contentTarget = document.querySelector("#createForm")

    return contentTarget.innerHTML = `<h2 id="addTaskH2">~Add A Task~</h2>
        <form id = "taskForm">
        <h6>Task</h6>
            <input type = "text" placeholder = "Task..." id="taskField"></input><br>
            <h6>Expected Completion Date</h6>
            <input type = "date" id = "date"></input><br><br>
            <button id = "submit" type = "button">Save Task</button>
        </form>   
    `
}
// this event listener is listening for an event on the save button. when it does that it will take the value from what you filled out and store it in an object. saveTaskList posts it to the database
eventHub.addEventListener("click", clickEvent => {
    if(clickEvent.target.id === "submit") {
        console.log("savebuttonclicked")
        const task = document.querySelector("#taskField").value
        const date = document.querySelector("#date").value 

        const NewTask = {
            userId: +sessionStorage.getItem("activeUser"),
            task,
            date,
            completed: false
        }
        if(!task || !date) {
            window.alert("Fill out the form please")
            return 
        }
        saveTaskList(NewTask)
        RenderCreateArea();
    }
})