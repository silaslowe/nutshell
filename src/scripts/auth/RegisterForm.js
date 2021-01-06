import { Nutshell } from "../Nutshell.js"

const contentTarget = document.querySelector(".auth--register")
const eventHub = document.querySelector(".container")

eventHub.addEventListener("click", (e) => {
  if (e.target.id === "register--button") {
    const username = document.querySelector("#register--username").value
    const email = document.querySelector("#register--email").value

    if (username !== "" && email !== "") {
      // Does the user exist?
      fetch(`http://localhost:8088/users?username=${username}`)
        .then((response) => response.json())
        .then((users) => {
          if (users.length === 0) {
            fetch("http://localhost:8088/users", {
              "method": "POST",
              "headers": {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                "username": username,
                "email": email,
              }),
            })
              .then((response) => response.json())
              .then((newUser) => {
                sessionStorage.setItem("activeUser", newUser.id)

                eventHub.dispatchEvent(new CustomEvent("userAuthenticated"))
              })
          } else {
            window.alert("Username already exists!  😭")
          }
        })
    }
  }
})

const render = () => {
  contentTarget.innerHTML += `
        <section class="register">
          <h4>Register</h4>
            <input id="register--username" type="text" placeholder="Enter your username">
            <input id="register--email" type="text" placeholder="Enter your email address">
            <div class="registerButton">
            <button id="register--button">Register</button>
            </div>
        </section>
    `
}

export const RegisterForm = () => {
  render()
}

