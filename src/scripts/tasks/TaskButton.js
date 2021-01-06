// Author: Travis Milner, Purpose: creating a button and listening for the click


// This function is responsible for actually displaying the task button
export const displayTaskButton = () => {
    const contentTarget = document.querySelector("#taskButton")

    return contentTarget.innerHTML += '<button id = "task">Create Task</button>'
}

// This is an eventHub that looks for a click on the task button and dispatches a new event 
const eventHub = document.querySelector(".container")

eventHub.addEventListener("click", clickEvent => {
    if(clickEvent.target.id === "task") {

        const customEvent = new CustomEvent("taskButtonClicked", {
            detail: {
                taskCreation: +clickEvent.target.value
            }
        })
        eventHub.dispatchEvent(customEvent)
    }
})