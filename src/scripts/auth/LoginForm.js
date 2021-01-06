import { LoadApp } from "../main.js"
import { Nutshell } from "../Nutshell.js"

const contentTarget = document.querySelector(".auth--login")
const eventHub = document.querySelector(".container")

eventHub.addEventListener("userAuthenticated", (e) => {
  contentTarget.innerHTML = "";
})

eventHub.addEventListener("storage", e => {
  console.log(e);
})

eventHub.addEventListener("click", (e) => {
  if (e.target.id === "login__button") {
    const username = document.querySelector("#login__username").value

    return fetch(`http://localhost:8088/users?username=${username}`)
      .then((response) => response.json())
      .then((users) => {
        if (users.length > 0) {
          const user = users[0]
          sessionStorage.setItem("activeUser", user.id)
          eventHub.dispatchEvent(new CustomEvent("userAuthenticated"))
        }
      })
  }
})

const render = () => {
  contentTarget.innerHTML += `
        <section class="login">
          <h4>Login</h4>
            <input id="login__username" type="text" placeholder="Enter your username">
            <div class="loginButton">
            <button id="login__button">Log In</button>
            </div>
        </section>
    `
}

export const LoginForm = () => {
  render()
}
