const express = require("express");
const exphbs = require('express-handlebars');
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();
const PORT = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoTechNews";
mongoose.connect(MONGODB_URI, {useNewUrlParser: true});

app.get("/", (req, res) => {
    res.render('index');
});

app.get("/find", (req, res) => {
    axios.get("https://www.bbc.com/news/technology").then(response => {
        const $ = cheerio.load(response.data);
        $("div .gs-c-promo").each((i, element) => {
            if (i >= 1) {
                console.log($(element).find(".gs-c-promo-heading__title").text());
            }
        })
    })
});

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
});