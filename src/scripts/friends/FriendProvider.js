/*  Author: Devin Kent
    Purpose: Manage friend data.
*/

import { getUserByUserId } from "../users/UserProvider.js";

let friends = [];

const eventHub = document.querySelector(".container")

export const useFriends = () => friends.slice();

export const getFriends = () => {
    return fetch(`http://localhost:8088/friends`)
        .then(response => response.json())
        .then(response => friends = response);
}

// Dispatch an event indicating that our data has changed in some way. Listened for in FriendList module.
const dispatchStateChange = () => {
    eventHub.dispatchEvent(new CustomEvent("friendListStateChanged"));
    eventHub.dispatchEvent(new CustomEvent("eventListStateChanged"));
    eventHub.dispatchEvent(new CustomEvent("chatListStateChanged"));
}

// Returns an array of all friends of a particular user. Requires either a user id or a user object.
export const getFriendArrayByUser = user => {
    // This checks whether we were given an id or an object, and adjusts the filter() call respectively.
    if (typeof (user) === "number")
        return useFriends().filter(fr => fr.userId === user)
    else if (typeof (user) === "object")
        return useFriends().filter(fr => fr.userId === user.id)

    return undefined;
}

// Finds a single friend object. Requires the user's id and the friend's user id.
export const getFriendByUserFriendIds = (user, friend) =>
    useFriends().find(fr => fr.userId === user && fr.followingId === friend)

// Adds a friend to the friends list. Requires the active user id and the user id of the friend to be added.
// When this method is called, it should be immediately followed by a call to dispatchStateChange().
// This method is currently untested.
export const addFriend = (userId, friendId) => {

    // First we check that this relationship doesn't already exist.
    // TODO: Indicate to the user that they are already friends?
    if (!getFriendByUserFriendIds(userId, friendId)) {
        // If the relationship doesn't exist, POST to the database.
        return fetch(`http://localhost:8088/friends`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: userId,
                followingId: friendId
            })
        })
        // If the relationship does exist, return the existing friend object.
    } else {
        return fetch(`http://localhost:8088/friends/${getFriendByUserFriendIds(userId, friendId).id}`)
        .then(response => response.json())
    }
}

// Retrieves the friend to be deleted via helper method, initiates a DELETE call to fetch().
// Requires ids of both the active user and the friend user. When this method is called,
// it should be immediately followed by a call to dispatchStateChange().
export const deleteFriend = (userId, friendId) => {
    const friendToDelete = getFriendByUserFriendIds(userId, friendId);
    return fetch(`http://localhost:8088/friends/${friendToDelete.id}`, {
        method: "DELETE"
    })
}

// Listens for an event from FriendList module which indicates a friend has been deleted,
// calls deleteFriend() and dispatches a state change event.
eventHub.addEventListener("deleteFriendEvent", e => {
    deleteFriend(e.detail.userId, e.detail.friendId)
        .then(dispatchStateChange);
});

eventHub.addEventListener("addFriendEvent", e => {
    addFriend(e.detail.userId, e.detail.friendId)
    .then(dispatchStateChange);
})