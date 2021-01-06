/*  Author: Devin Kent
    Purpose: Manage user data.
*/

let users = [];

export const useUsers = () => users.slice();

export const getUsers = () => {
    return fetch(`http://localhost:8088/users`)
    .then(response => response.json())
    .then(response => users = response);
}

// Given a user's id, return the user object associated with that id.
export const getUserByUserId = (id) => users.find(user => user.id === id);

export const getUserByUsername = (name) => users.find(user => user.username === name);