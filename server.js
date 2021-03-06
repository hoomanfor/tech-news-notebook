const express = require("express");
const exphbs = require('express-handlebars');
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();
const db = require("./models");
const PORT = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(express.static("node_modules"));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoTechNews";
mongoose.connect(MONGODB_URI, {useNewUrlParser: true});

app.get("/", (req, res) => {
    res.render('index');
});

app.get("/library", (req, res) => {
    db.Article.find({}).lean()
        .then((found) => {
            res.render("library", {data: found});
            // res.json(found);
        })
        .catch((error) => {
            res.json(error);
        })
});

app.get("/find", (req, res) => {
    axios.get("https://www.bbc.com/news/technology").then(response => {
        const $ = cheerio.load(response.data);
        const scrapedData = [];
        $("div.gs-c-promo").each((i, element) => {
            if (i >= 1 && i < 8) {
                const scrapedArticle = {};
                scrapedArticle.id = i;
                scrapedArticle.headline = $(element).find(".gs-c-promo-heading__title").text().trim();
                scrapedArticle.summary = $(element).find(".gs-c-promo-summary").text().trim();
                scrapedArticle.url = $(element).find("a.gs-c-promo-heading").attr("href");
                if (scrapedArticle.url) {
                    if ($(element).find("a.gs-c-promo-heading").attr("href").trim()[0] !== "h") {
                        scrapedArticle.url = "https://www.bbc.com" + $(element).find("a.gs-c-promo-heading").attr("href").trim();
                    } else {
                        scrapedArticle.url = $(element).find("a.gs-c-promo-heading").attr("href").trim();
                    }
                } else {
                    scrapedArticle.url = "#";
                }
                scrapedData.push(scrapedArticle);
            }
        })
        console.log("scrapedData", scrapedData);
    res.render("find", {data: scrapedData});
    })
});

app.post("/articles", (req, res) => {
    db.Article.create(req.body)
        .then((result) => {
            console.log(result);
        })
        .catch((error) => {
            console.log(error);
        })
});

app.get("/articles/:id", (req, res) => {
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(dbArticle => {
            res.json(dbArticle);
        })
        .catch(error => {
            res.json(error);
        })
});

app.post("/articles/:id", (req, res) => {
    db.Note.create(req.body)
        .then(dbNote => {
            return db.Article.findOneAndUpdate({_id: req.params.id}, {$push: {note: dbNote._id}}, {new: true})
        })
        .then(dbArticle => {
            res.json("Note Added!");
        })
        .catch(error => {
            res.json(error);
        });
});

app.delete("/articles/:id", (req, res) => {
    db.Article.deleteOne({ _id: req.params.id })
        .then(result => {
            res.json("Article Deleted!")
        })
        .catch(error => {
            res.json(error);
        })
})

app.delete("/articles/notes/:id", (req, res) => {
    db.Note.deleteOne({ _id: req.params.id })
        .then(result => {
            res.json("Note Deleted!")
        })
        .catch(error => {
            res.json(error);
        })
})

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
});