// authored by kyle simmons. this module is the html component for the news cards

// a function that renders the individual news article cards once an object is passed in
const eventHub = document.querySelector(".container")
export const newsArticleCard = (article) => {
    if (article.userId === +sessionStorage.getItem("activeUser")){

        return `
        <section id="article--${article.id}"  class="articleCard" value="${article.id}">
        
        <h4>${article.titleOfArticle}</h4>
        <p>About: ${article.synopsisOfArticle}</p>
        <p>Url: <a href="${article.urlOfArticle}" target="_blank">${article.titleOfArticle}</a></p>
        <p>Posted by: ${article.user.username}</p>
        <div class="delete">
        ${renderDeleteButton(article)}
        </div>
        </section>
        `
    } else {
        return  `
        <section id="article--${article.id}"  class="articleCard friendsPost" value="${article.id}">
        <h4>${article.titleOfArticle}<h4>
        <p>About: ${article.synopsisOfArticle}</p>
        <p>Url: <a href="${article.urlOfArticle}" target="_blank">${article.titleOfArticle}</a></p>
        <p>Posted by: ${article.user.username}</p>
        <div class="delete">
        ${renderDeleteButton(article)}
        </div>
        </section>
        `
    }
}


// a function that checks if the current user is the one who posted an article. if so then add a delete button to the card
const renderDeleteButton = (article) =>{
    if (article.userId === +sessionStorage.getItem("activeUser")){
        return ` <button class="deleteButton" id="deleteArticle--${article.id}">Delete</button>
                    <button class="editButton" id="editArticle--${article.id}">Edit</button>
        `
    }else{
        return ``
    }
}

eventHub.addEventListener("click", event =>{
    if (event.target.id.startsWith("editArticle--")){

        const [prefix, id] = event.target.id.split("--")
        const customEvent = new CustomEvent("editButton", {
            detail:{
                articleId: id
            }
        })
        eventHub.dispatchEvent(customEvent)
        // console.log("Edit Article Button was pressed. Id of --", id)
    }
})

export const renderFormInNewsCard = (article) =>{
    const contentTarget = document.querySelector(`#article--${article}`)
    contentTarget.innerHTML = `<h6>Title Of Article</h6>
    <input type="hidden" name="articleId" id="editArticleId">
    <input type="text" id="editTitleOfArticle" name="titleOfArticle">
    <h6>Synopsis of Article</h6>
    <input type="text" id="editAboutArticle" name="aboutArticle">
    <h6>Url</h6>
    <input type="text" id="editArticleUrl" name="articleUrl">
    <br>
    <button id="updateNewsArticle--${article}">Post</button>`
}