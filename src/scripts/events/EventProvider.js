/*  Author: Devin Kent
    Purpose: Manage event data.
*/

import { getFriendArrayByUser } from "../friends/FriendProvider.js"
import { RenderCreateArea } from "../home/HomePage.js"
import { EventList } from "./EventList.js"

let events = []
const eventHub = document.querySelector(".container")

export const useEvents = () => events.slice()

export const getEvents = () => {
  return fetch(`http://localhost:8088/events`)
    .then((response) => response.json())
    .then((response) => (events = response))
}

const addEvent = (name, eventCity, eventState, eventDate, userId) => {
  return fetch(`http://localhost:8088/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      eventCity,
      eventState,
      eventDate,
      userId,
    }),
  })
}

const deleteEvent = (eventId) => {
  return fetch(`http://localhost:8088/events/${eventId}`, {
    method: "DELETE",
  })
}

eventHub.addEventListener("editEvent", (e) => {
  console.log(e)
  editEvent(e.detail.id, e.detail)
})

const editEvent = (eventId, event) => {
  return fetch(`http://localhost:8088/events/${eventId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  }).then(() => {
    eventHub.dispatchEvent(new CustomEvent("eventListStateChanged"))
  })
}

export const getEventById = (id) => useEvents().find((ev) => ev.id === id)

// Get an array of events for a specific users, including friends' events. Can take either a user object or an ID.
export const getEventsArrayByUser = (user) => {
  // Get a list of this user's friends.
  const friends = getFriendArrayByUser(user)
  if (typeof user === "number") {
    // Loop through all events
    return useEvents().filter((ev) => {
      // If the event's userId matches the user, return it
      if (user === ev.userId) {
        return true
      } else {
        // Otherwise, loop through the friends of this user and see if any friends
        // match the ID of event's userId.
        return friends.find((fr) => fr.followingId === ev.userId)
      }
    })
  }
  // Same code, except if we are given an object instead of a number.
  if (typeof user === "object")
    return useEvents().filter((ev) => {
      if (user.id === ev.userId) {
        return true
      } else {
        return friends.find((fr) => fr.followingId === ev.userId)
      }
    })
}

// Called after any changes to the database, listened for in EventList.js.
const dispatchStateChange = () => {
  eventHub.dispatchEvent(new CustomEvent("eventListStateChanged"))
}

eventHub.addEventListener("addEventEvent", (e) => {
  addEvent(
    e.detail.eventName,
    e.detail.eventCity,
    e.detail.eventState,
    e.detail.eventDate,
    e.detail.userId
  ).then(() => {
    dispatchStateChange()
    RenderCreateArea()
  })
})

eventHub.addEventListener("deleteEventEvent", (e) => {
  deleteEvent(e.detail.eventId).then(() => {
    dispatchStateChange()
  })
})

// eventHub.addEventListener("editEventEvent", (e) => {
//   editEvent(e.detail.eventId).then(() => {
//     dispatchStateChange()
//   })
// })
