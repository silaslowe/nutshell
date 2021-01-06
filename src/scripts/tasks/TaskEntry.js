// Author: Travis Milner, Purpopse: This module is responsible for rendering a form based on Id. It also looks for click and change events and renders/updates the database based on that. 


import { deleteTask, useTasks } from "./TaskDataProvider.js"
import {render} from "./TaskList.js"
import {getTasks} from "./TaskDataProvider.js"

const eventHub = document.querySelector(".container")
// This function is responsible for returning the task that is saved and displaying the html needed for task list
export const TaskEntryComponent = (entry) => {
    return `
        <section id = "entry--${entry.id}" class = "taskCard" value = "${entry.id}">
        <ul>
        <li>Task: ${entry.task}<input type = "checkbox" id = "check--${entry.id}"></input></li>
        <li>Date to be Completed: ${entry.date}</li>
         </ul>
         <div class="taskDelete">
         <button id = "deleteTask--${entry.id}">Delete</button>
        </div>
         <button id = "editTask--${entry.id}">Edit</button>
        
        
        
        </section>
    `
}
// this is an event listener that listens for the click on a button of delete and then gets the tasks from the database and renders the new tasks to the dom
eventHub.addEventListener("click", event => {
    if (event.target.id.startsWith("deleteTask--")) {
        const [prefix,id] = event.target.id.split("--")
        deleteTask(id).then(
            getTasks).then(
            () => {
                const updatedTask = useTasks()
                render(updatedTask)
            }

        )
    }
    if(event.target.id.startsWith("editTask--")) {
        console.log("edit got clicked")
        const [prefix, id] = event.target.id.split("--")
        console.log(id)
        event.target.parentElement.innerHTML = `<form id = "taskForm">
        <input type = "text" placeholder = "Task..." id="taskField--${id}" value = "${getTaskById(id).task}"></input><br>
        <label for = "date">Expected Completion Date</label><br>
        <input type = "date" id = "taskDate--${id}" value = "${getTaskById(id).date}"></input>
        <button id = "editSaveTask--${getTaskById(id).id}" type = "button">Save Task</button>
    </form> `

        
}
    if(event.target.id.startsWith("editSaveTask--")) {
        const [prefix, id] = event.target.id.split("--")
        const newTask = document.getElementById(`taskField--${id}`).value 
        const newDate = document.getElementById(`taskDate--${id}`).value
        const tasks = getTaskById(id)
        eventHub.dispatchEvent(new CustomEvent("taskEdited", {
            detail: {
                id: tasks.id,
                userId: tasks.userId,
                task: newTask,
                date: newDate,
                completed: false

        }})

        )
        
    }
})

eventHub.addEventListener("taskEdited", e => {
    console.log(e)
    taskComplete(e.detail)
    .then(getTasks).then(
        () => {
            const editedTask = useTasks()
            render(editedTask)
        }
    )
})
// this is an event listener that looks for a change event on the checkbox next to each task. it then creates a "new object" with the completed field equaling true and then renders the database to the dom again
eventHub.addEventListener("change", event => {
    if(event.target.id.startsWith("check--")) {
        console.log("completegotclicked")
        const [prefix, id] = event.target.id.split("--")
       
        const task = useTasks().find(t => t.id === +id)
        const taskCompleted = {
            id: task.id,
            userId: task.userId,
            task: task.task,
            completed: true
        }
        taskComplete(taskCompleted)
        .then(getTasks).then(
            () => {
                const updatedTask = useTasks()
                render(updatedTask)})
    }
})
// this is a function that edits the database based on task id. I.E when you click the checkbox.
const taskComplete = (task) => {
    return fetch (`http://localhost:8088/tasks/${task.id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"
    },
        body: JSON.stringify(task)
    })
}

export const getTaskById = (id) => {
    return useTasks().find(task => task.id === parseInt(id))
}