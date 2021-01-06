import { ChatList } from "./chat/ChatList.js"
import { EventList } from "./events/EventList.js"
import { getEvents } from "./events/EventProvider.js"
import { FriendList } from "./friends/FriendList.js"
import { getFriends } from "./friends/FriendProvider.js"
import { getUsers } from "./users/UserProvider.js"
import { renderNewsButton } from "./news/NewsButton.js"
import { newsClickEventHeard } from "./news/NewsForm.js"
import { getNews } from "./news/NewsDataProvider.js"
import { NewsList } from "./news/NewsList.js"
import { displayTaskButton } from "./tasks/TaskButton.js"
import { TaskFormRender, TaskList } from "./tasks/TaskList.js"
import { defaultWeather } from "./weather/WeatherSelect.js"
import "./events/EventForm.js"
import { displayName } from "./users/UserNameDisplay.js"
import {hideDivs} from "./CSS.js"
const mainBody = document.querySelector(".mainBody")

export const Nutshell = () => {
    mainBody.innerHTML = `
  <aside class="asideLeft">
  <div class="asideLeft__user">
      <h2>---USER---</h2>
      </div>
  <div class="asideLeft__weather">
  <div class="h4Nashville">
                        </div>
                        <div class="weatherBox">
                            </div>
      
      </div>
  <div class="asideLeft__taskList">
      <h2>~Task List~</h2>
     </div>
  
</aside>
<article class="centerBody">
  <div class="centerBody__create">
      <div id="createForm">
          <h2>~CREATE~</h2>
      </div>
  <div class="centerBody__create-Buttons">
      <div id="taskButton">
          

      </div>
      <div id="eventButton">
          <button id="eventButton"> Create Event</button>

      </div>
      <div id="newsButton">
          <button id="newsButton">Create News</button>

      </div>
  </div>
  
  </div>
  <div class="centerBody__mainFeed">

      <div class="centerBody__eventFeed">
          
          <div class="eventFeed">
              <div class="eventCard">

              </div>
              <div class="eventCard">

              </div>
              <div class="eventCard">

              </div>
          </div>
  </div>
  <div class="centerBody__newsFeed">
      <h2>---News Feed---</h2>
      
      
  </div>
</div>
</article>
<aside class="asideRight">
  <div class="asideRight__friendsList">
      
      </div>    
  <div class="asideRight__chat">
      <div class="asideRight__chat__output">
      </div>
      <div class="asideRight__chat__input">
      </div>
    </div>  
</aside>`
displayTaskButton()
TaskFormRender()
TaskList()
renderNewsButton()
newsClickEventHeard()
NewsList()
defaultWeather()
getFriends().then(getUsers).then(FriendList).then(displayName)
getEvents().then(EventList)
ChatList();
hideDivs()

}
