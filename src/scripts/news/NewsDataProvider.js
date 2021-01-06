// authored by kyle simmons. this is the data provider for the news section

import {getFriendArrayByUser} from '../friends/FriendProvider.js'

let news = []
// gets the news from the api
export const getNews= () =>{
    return fetch("http://localhost:8088/articles?_expand=user")
    .then(response => response.json())
    .then(
        parsedNews =>{
            news = parsedNews
        }
    )
}
// sorts news articles by date
export const useNews = () => {
    const sortedByDate = news.sort(
        (currentPost, nextPost) =>
            nextPost.timeOfArticlePost - currentPost.timeOfArticlePost
    )
    return sortedByDate
}
// saves news articles
export const saveNews = news => {
    return fetch('http://localhost:8088/articles', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(news)
    })
    .then(getNews)
    .then(dispatchStateChangeEvent)
}
// enables delete functionality
export const deleteNews = newsId => {
    
    return fetch(`http://localhost:8088/articles/${newsId}`, {
        method: "DELETE"
    })
        .then(getNews)
}

const eventHub = document.querySelector(".container")
// change event for the news section
const dispatchStateChangeEvent = () =>{
    const newsStateChangedEvent = new CustomEvent("newsStateChanged")

    eventHub.dispatchEvent(newsStateChangedEvent)
}
// helper function created by devin.
export const getNewsArrayByUser = user => {
    // Get a list of this user's friends.
    const friends = getFriendArrayByUser(user);
    if (typeof (user) === "number") {
        // Loop through all events
        return useNews().filter(ev => {
            // If the event's userId matches the user, return it
            if (user === ev.userId) {
                return true;
            } else {
                // Otherwise, loop through the friends of this user and see if any friends
                // match the ID of event's userId.
                return friends.find(fr => fr.followingId === ev.userId)
            }
        })
    }
}

export const editNews = (article, articleId) =>{
    return fetch (`http://localhost:8088/articles/${articleId}`,{
        method: "Put",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(article)
    })
        .then(getNews)
        .then(dispatchStateChangeEvent)
}