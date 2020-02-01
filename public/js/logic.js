
function classToggle() {
    const navs = document.querySelectorAll('.nav-items')
    navs.forEach(nav => nav.classList.toggle('toggle-show'));
}

document.querySelector('.toggle').addEventListener('click', classToggle);

$(document).on("click", "#save", function (event) {
    const id = $(this).attr("button-id");
    const article = {
        headline: $("#headline-" + id).text(),
        summary: $("#summary-" + id).text(),
        url: $("#url-" + id).text()
    }
    console.log(article);
})