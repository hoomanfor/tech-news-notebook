
function classToggle() {
    const navs = document.querySelectorAll('.nav-items')
    navs.forEach(nav => nav.classList.toggle('toggle-show'));
}

function getNotes(id) {
    $.getJSON("/articles/" + id, response => {
        console.log("getJSON", response.note);
        $("#view-notes-" + id).html("");
        response.note.forEach(function(element) {
            const li = $("<li>");
            li.html(element.content + "<span class='moment'>" + moment(element.created).format("h:mmA MM/DD/YYYY") + "</span>");
            $("#view-notes-" + id).append(li)
        })
    })
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
        getNotes(id);
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
        getNotes(id);
    })
    $("#input-" + id).val("");
})

console.log("Moment Works!", moment("2020-02-04T21:57:00.624Z").format("h:mmA MM/DD/YYYY"))