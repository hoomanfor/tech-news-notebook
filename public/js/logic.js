
function classToggle() {
    const navs = document.querySelectorAll('.nav-items')
    navs.forEach(nav => nav.classList.toggle('toggle-show'));
}

function getNotes(id) {
    $.getJSON("/articles/" + id, response => {
        $("#view-notes-" + id).html("");
        response.note.forEach(function(element) {
            const li = $("<li>");
            li.html(element.content + "<span class='moment'>" + moment(element.created).format("h:mmA MM/DD/YYYY") + "</span>" + "<i article-id='" + id + "' note-id='" + element._id + "' class='far fa-trash-alt'></i>");
            $("#view-notes-" + id).append(li)
        })
    })
}

document.querySelector('.toggle').addEventListener('click', classToggle);

$(document).on("click", "#save", function (event) {
    const id = $(this).attr("button-id");
    const article = {
        headline: $("#url-" + id).text(),
        summary: $("#summary-" + id).text(),
        url: $("#url-" + id).attr("href")
    }
    $.ajax({
        method: "POST",
        url: "/articles",
        data: article
    }).then(response => {
        console.log(response)
    })
    $("#scraped-article-" + id).remove();
});

$(document).on("click", "#view-notes", function (event) {
    const status = $(this).text();
    const id = $(this).attr("button-id");
    if (status === "View Notes") {
        $("#notes-" + id).removeClass("hide")
        $(this).text("Hide Notes")
        getNotes(id);
    } else {
        $("#notes-" + id).addClass("hide")
        $(this).text("View Notes")
    }
});

$(document).on("click", "#delete-article", function (event) {
    const id = $(this).attr("button-id");
    $.ajax({
        method: "DELETE",
        url: "/articles/" + id
    }).then(response => {
        console.log(response)
        location.reload("/library");
    })
});

$(document).on("click", "button[type='submit']", function (event) {
    event.preventDefault();
    const id = $(this).attr("button-id");
    const content = $("#input-" + id).val().trim();
    $.ajax({
        method: "POST",
        url: "/articles/" + id,
        data: {
            "content": content
        }
    }).then(response => {
        console.log(response)
        getNotes(id);
    })
    $("#input-" + id).val("");
})

$(document).on("click", ".fa-trash-alt", function (event) {
    const noteId = $(this).attr("note-id");
    const articleId = $(this).attr("article-id");
    $.ajax({
        method: "DELETE",
        url: "/articles/notes/" + noteId
    }).then(response => {
        console.log(response)
        getNotes(articleId)
    })
})

$(document).on("click", "#find", function (event) {
    $("#spinner").html("<i class='fas fa-spinner'></i><h3>BBC.com Scrape In Progress</h3>");
})
