
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
    $.ajax({
        method: "POST",
        url: "/articles",
        data: article
    }).then(response => {
        console.log(response)
    })
    $(this).parent().remove();
});

$(document).on("click", "#view-notes", function (event) {
    const status = $(this).text();
    const id = $(this).attr("button-id");
    if (status === "View Notes") {
        $("#notes-" + id).removeClass("hide")
        $(this).text("Hide Notes")
        $.getJSON("/articles/" + id, response => {
            console.log("getJSON", response);
        })
    } else {
        $("#notes-" + id).addClass("hide")
        $(this).text("View Notes")
    }
});

$(document).on("click", "button[type='submit']", function (event) {
    event.preventDefault();
    const id = $(this).attr("button-id");
    const content = $("#input-" + id).val().trim();
    console.log("prior to post", content);
    $.ajax({
        method: "POST",
        url: "/articles/" + id,
        data: {
            "content": content
        }
    }).then(response => {
        console.log(response)
    })    
})