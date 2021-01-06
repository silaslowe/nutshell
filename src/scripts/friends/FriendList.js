/*  Author: Devin Kent
    Purpose: Draw a list of friends for a given user; listen for add/delete friend events and
        dispatch them to FriendProvider.js
*/

import { getUserByUserId } from "../users/UserProvider.js";
import { Friend } from "./Friend.js";
import { getFriendArrayByUser, getFriends } from "./FriendProvider.js"

const eventHub = document.querySelector(".container");

let userId;

export const FriendList = () => {
    const contentTarget = document.querySelector(".asideRight__friendsList");
    // Find the user we are displaying for. Forced to be user 1 until auth is added.
    userId = parseInt(sessionStorage.getItem(`activeUser`))
    // Get an array of all this user's friends (see FriendProvider module), then get an array of
    // user objects from the friends array (see UserProvider module).
    const friendArr = getFriendArrayByUser(userId).map(fr => getUserByUserId(fr.followingId));
    let htmlRep = "<h4>~Friends~</h4>";
    htmlRep += AddFriendButton();
    htmlRep += `<ul>${friendArr.map(fr => `${Friend(fr)}${AddDeleteButton(fr.id)}`).join("")}</ul>`;
    contentTarget.innerHTML = htmlRep;
}

const AddFriendButton = () => {
    return `<button id="addFriendButton">Add Friend</button>
    <input type="text" placeholder="Username" id="addFriendTextInput">`;
}

const AddDeleteButton = (id) => {
    return `<button id="deleteFriend--${id}">Delete</button>`;
}

// Listen for the delete user button being clicked. Dispatch an event containing the friend id and
// the active user id.
eventHub.addEventListener("click", e => {
    if (e.target.id.startsWith("deleteFriend--")) {
        const [temp, friendId] = e.target.id.split("--");
        const deleteEvent = new CustomEvent("deleteFriendEvent", {
            detail: {
                userId,
                friendId: parseInt(friendId)
            }
        })
        eventHub.dispatchEvent(deleteEvent);
    }
    if (e.target.id === "addFriendButton") {
        const username = document.querySelector("#addFriendTextInput").value
        fetch(`http://localhost:8088/users/?username=${username}`)
            .then(response => response.json())
            .then(response => {
                if (response.length > 0) {
                    if (window.confirm(`Do you really want to add ${response[0].username} to your friends?`)) {
                        const addEvent = new CustomEvent("addFriendEvent", {
                            detail: {
                                userId: parseInt(sessionStorage.getItem("activeUser")),
                                friendId: response[0].id
                            }
                        });
                        eventHub.dispatchEvent(addEvent);
                    }
                } else {
                    // Display user not found message.
                }
            });
    }
})

// If the friend list changes for any reason (add, delete, edit) then update the friends list and redraw.
eventHub.addEventListener("friendListStateChanged", e => {
    getFriends()
        .then(() => {
            FriendList();
            eventHub.dispatchEvent(new CustomEvent("newsStateChanged"));
            eventHub.dispatchEvent(new CustomEvent("eventListStateChanged"));
        })
})