export const renderMessageForm = (contentTarget) => {
  contentTarget.innerHTML = `
  <h4>Message</h4>
  <textarea id="messageInput" name="messageInput" rows="5" cols="30"></textarea> <br>
  <div class="chatButton"><button id="messageInputBtn">Post</button></div>
  `
}
