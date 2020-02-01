const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ScrapeSchema = new Schema({
  headline: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
});

const Scrape = mongoose.model("Scrape", ScrapeSchema);

module.exports = Scrape;
