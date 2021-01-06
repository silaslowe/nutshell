/*  Author: Devin Kent
    Purpose: Methods for re-rendering areas on the home page to their default state after they
        have been modified for some reason.
*/

export const RenderCreateArea = () => {
    const contentTarget = document.querySelector("#createForm");
    contentTarget.innerHTML =`
    <h2>~CREATE~</h2>
    </div>`
}