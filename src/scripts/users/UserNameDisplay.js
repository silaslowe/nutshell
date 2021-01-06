import { getUserByUserId } from "./UserProvider.js"

export const displayName = () =>{
    const contentTarget = document.querySelector(".asideLeft__user")
    const activeUser = parseInt(sessionStorage.getItem("activeUser"))
   const userObj = getUserByUserId(activeUser)

   contentTarget.innerHTML = `<div class="userDisplay"><h2>~Hello, ${userObj.username}~</h2>
   <div class="userPictureDiv">
<img class="userPicture" src="./kisspng-computer-icons-silhouette-my-account-icon-5b388d486ee876.1608773115304328404543.png" alt="">
   </div>
   
   </div>`
    
    
}
