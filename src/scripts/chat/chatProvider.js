import { ChatList } from "./ChatList.js"
let messages = []

// A local copy of the timestamp of the most recent chat message
let mostRecentChat = 0

const eventHub = document.querySelector(".container")

// Listen for the storage event that fires every time localStorage is updated. If our local most recent
// timestamp is lower than the timestamp in localStorage, update our chat list.
eventHub.addEventListener("storage", (e) => {
  console.log(e)
  if (useMostRecentChat() < parseInt(localStorage.getItem("mostRecentChatMessage"))) {
    getMessages().then(ChatList)
  }
})

eventHub.addEventListener("editMessage", (e) => {
  // Pass the detail object, which contains all the correct properties, onto the editMessage function.
  editMessage(e.detail)
})

const dispatchStateChangeEvent = () => {
  const chatStateChangeEvent = new CustomEvent("chatStateChanged")
  eventHub.dispatchEvent(chatStateChangeEvent)
}

export const useMostRecentChat = () => mostRecentChat

export const setMostRecentChat = (time) => (mostRecentChat = time)

export const useMessages = () => {
  return messages.slice().sort((a, b) => b.postTime - a.postTime)
}

export const getMessages = () => {
  return fetch("http://localhost:8088/messages")
    .then((response) => response.json())
    .then((parsedMesssages) => {
      messages = parsedMesssages
    })
}

export const getMessageById = (id) => useMessages().find((message) => message.id === parseInt(id))

export const saveMessage = (message) => {
  // Update our local most recent time stamp if the new message's timestamp is higher (not guaranteed,
  // because messages are sent asynchronously)
  if (useMostRecentChat() < message.updateTime) setMostRecentChat(message.updateTime)
  // Compare timestamps to see if we need to update localStorage's timestamp
  if (parseInt(localStorage.getItem("mostRecentChatMessage")) < useMostRecentChat()) {
    localStorage.setItem("mostRecentChatMessage", useMostRecentChat())
  }
  // If localStorage does not have a timestamp at all, add one.
  if (!localStorage.getItem("mostRecentChatMessage"))
    localStorage.setItem("mostRecentChatMessage", useMostRecentChat())

  return fetch("http://localhost:8088/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  })
    .then(getMessages)
    .then(dispatchStateChangeEvent)
}

export const editMessage = (message) => {
  return fetch(`http://localhost:8088/messages/${message.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  })
    .then(getMessages)
    .then(ChatList)
}

export const deleteMessage = (messageId) => {
  return fetch(`http://localhost:8088/messages/${messageId}`, {
    method: "DELETE",
  }).then(getMessages)
}
