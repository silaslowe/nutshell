/*  Author: Devin Kent, TRAVIS MILNER, Salis
    Purpose: Draw the list of events.
*/

import { getEventsArrayByUser, getEvents, getEventById } from "./EventProvider.js"
import { EventCard, EventCardFirst } from "./Event.js"
import { eventWeather } from "../weather/WeatherSelect.js"

const eventHub = document.querySelector(".container")

export const EventList = () => {
    console.trace();
  const contentTarget = document.querySelector(".eventFeed")
  const user = parseInt(sessionStorage.getItem("activeUser"))

  const evArray = getEventsArrayByUser(user)
  evArray.sort((evOne, evTwo) => {
    const first = Date.parse(evOne.eventDate)
    const second = Date.parse(evTwo.eventDate)
    return first - second
  })

  evArray.forEach((ev) => {
    const date = Date.parse(ev.eventDate)

    if (date < Date.now() - 1000 * 60 * 60 * 24) {
      eventHub.dispatchEvent(
        new CustomEvent("deleteEventEvent", {
          detail: {
            eventId: ev.id,
          },
        })
      )
    }
  })
  let htmlRep = "<h2>~Event List~</h2>"
  htmlRep += evArray
    .map((ev, i) => {
      if (i === 0) return `${EventCardFirst(ev)}`
      else return `${EventCard(ev)}`
    })
    .join("")
  contentTarget.innerHTML = htmlRep
}

eventHub.addEventListener("eventListStateChanged", (e) => {
  getEvents().then(EventList)
})

eventHub.addEventListener("click", (e) => {
  if (e.target.id.startsWith("deleteEvent")) {
    const [temp, eventId] = e.target.id.split("--")
    eventHub.dispatchEvent(
      new CustomEvent("deleteEventEvent", {
        detail: {
          eventId,
        },
      })
    )
  }
  if (e.target.id.startsWith("eventWeather")) {
    const [temp, eventId] = e.target.id.split("--")
    const ev = getEventById(parseInt(eventId))
    const eventDates = Date.parse(ev.eventDate)
    const todayDate = Date.now()
    const difference = (eventDates - todayDate) / (1000 * 60 * 60 * 24)
    console.log(eventDates)
    console.log(todayDate)
    console.log(difference)
    if (difference < 7) {
      eventWeather(ev.eventCity, ev.eventState, Math.ceil(difference))
      return `<button class="eventWeather" id="eventWeather--${ev.id}">Show Weather</button>`
    } else {
      return ""
    }
  }

  eventHub.addEventListener("click", (e) => {
    if (e.target.id.startsWith("deleteEvent")) {
      const [temp, eventId] = e.target.id.split("--")
      eventHub.dispatchEvent(
        new CustomEvent("deleteEventEvent", {
          detail: {
            eventId,
          },
        })
      )
    }
  })
  if (e.target.id.startsWith("editEventButton")) {
    const [prefix, id] = e.target.id.split("--")
    let [month, date, year] = new Date().toLocaleDateString("en-US").split("/")
    const ev = getEventById(parseInt(id))
    e.target.parentElement.parentElement.innerHTML = `<input type="date" id="editEventForm__eventDate--${ev.id}" value="${year}-${month}-${date}">
    <input type="text" id="editEventForm__eventName--${ev.id}" value="${ev.name}">
    <input type="text" id="editEventForm__eventCity--${ev.id}" value="${ev.eventCity}">
    <input type="text" id="editEventForm__eventState--${ev.id}" value="${ev.eventState}">
    <button id="editEventForm__addEventButton--${ev.id}">Save Update</button>
    `
  }
  if (e.target.id.startsWith("editEventForm__addEventButton")) {
    const [prefix, id] = e.target.id.split("--")
    const ev = getEventById(parseInt(id))
    console.log(ev)
    const updatedEventDate = document.getElementById(`editEventForm__eventDate--${ev.id}`).value
    const updatedEventName = document.getElementById(`editEventForm__eventName--${ev.id}`).value
    const updatedEventCity = document.getElementById(`editEventForm__eventCity--${ev.id}`).value
    const updatedEventState = document.getElementById(`editEventForm__eventState--${ev.id}`).value

    eventHub.dispatchEvent(
      new CustomEvent("editEvent", {
        detail: {
          userId: ev.userId,
          name: updatedEventName,
          eventDate: updatedEventDate,
          eventCity: updatedEventCity,
          eventState: updatedEventState,
          id: ev.id,
        },
      })
    )
    EventList()
  }
})
