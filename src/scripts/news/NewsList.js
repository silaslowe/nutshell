// authored by kyle. this module is responsible for posting the correct news articles to the news feed

import { renderNewsButton } from "./NewsButton.js"
import { newsArticleCard, renderFormInNewsCard } from "./NewsCard.js"
import { deleteNews, getNews, useNews, getNewsArrayByUser } from "./NewsDataProvider.js"
import { useFriends, getFriendArrayByUser, getFriends } from "../friends/FriendProvider.js"

const eventHub = document.querySelector(".container")
// change event called to rerender the news section on change
eventHub.addEventListener("newsStateChanged", () =>NewsList())
// this posts the articles to the news feed
export const NewsList = () =>{
    // get the news articles. then get the friends list.
    getNews()
    .then(getFriends)
    .then(() =>{
        const allArticles = useNews()
    // retrieves the friends array based off of current logged in user
        const friendsArray = getFriendArrayByUser(+sessionStorage.getItem("activeUser"))
    // if true add to the filtered array
        const filteredArticles = allArticles.filter(fr => {
            if(fr.userId === +sessionStorage.getItem("activeUser")) {
                return true 
            } else 
            {return friendsArray.find(f => f.followingId === fr.userId)}
        })
        render(filteredArticles)
    })
}
// render function for the news list
const render = (articleArray) =>{
    // variable for where to place the articles
    const contentTarget = document.querySelector('.centerBody__newsFeed')
    // returning the user Id based off of who's logged in
    const user = parseInt(sessionStorage.getItem("activeUser"));
    // getting the array for the news based off of user
    const evArray = getNewsArrayByUser(user);
    // making sure news list appears 1st 
    let articleHTMLRep = "<h2>~News Feed~</h2>"
    // mapp thru defined array. an article object is passed thru the news article card function to create the appropriate html
    articleHTMLRep += evArray.map(ev => `${newsArticleCard(ev)}`).join("")
    // add it to the DOM
    contentTarget.innerHTML =`${articleHTMLRep}`
}


// event for delete button
eventHub.addEventListener("click", event =>{
    // targets button starting with deleteArticle --
        if (event.target.id.startsWith("deleteArticle--")){
            // gets specific id by splitting id name into two different variables
            const [prefix, id] = event.target.id.split("--")
            // delete news article from api based off of specific id passed in
            deleteNews(id).then(
                () =>{
                    // rerender the news articles after delete to show the change
                    const updatedArticles = useNews()
                    render(updatedArticles)
                }
                )
            }
    
})

eventHub.addEventListener("editButton", (event) =>{
    renderFormInNewsCard(event.detail.articleId)
    const newsCollection = useNews()
    const articleToEdit = newsCollection.find( articleObj =>{
        return articleObj.id === parseInt(event.detail.articleId)
    })
    let articleId = document.querySelector("#editArticleId")
    let title = document.querySelector("#editTitleOfArticle")
    console.log(title)
    let about = document.querySelector("#editAboutArticle")
    let url = document.querySelector("#editArticleUrl")
    title.value = articleToEdit.titleOfArticle
    about.value = articleToEdit.synopsisOfArticle
    url.value = articleToEdit.urlOfArticle
    articleId.value = articleId.id
})


