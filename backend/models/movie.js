const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    min: 5,
    max: 50,
  },
  releaseYear: Number,
  watch: Boolean,
});

const Movie = mongoose.model("movie", MovieSchema);
module.exports = { Movie };
