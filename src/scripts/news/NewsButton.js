// authored by kyle simmons. this module is responsible for rendering the post news article button

const eventHub = document.querySelector(".container")
// rendering button to the correct content Target
export const renderNewsButton = () =>{
    const contentTarget = document.querySelector("#newsButton")
    contentTarget.innerHTML=`
    <button id="postArticleButton"> Post News Article</button>
    `
}
// event dispatched that listens for the post Article Button click
eventHub.addEventListener("click", event =>{
    if (event.target.id === "postArticleButton"){
        const customEvent = new CustomEvent("postArticleButtonClicked", {
            detail:{
                articleId: event.target.value
            }
        })
        eventHub.dispatchEvent(customEvent)
    }
});