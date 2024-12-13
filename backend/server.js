const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Movie } = require("./models/movie.js");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());


mongoose.connect("mongodb://localhost:27017/moviesdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/movies", async (req, res) => {
  try {
    const newMovie = new Movie(req.body);
    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get("/movie/search", async (req, res) => {
  const query = req.query.q;
  try {
    const movies = await Movie.find({ title: new RegExp(query, "i") });
    res.json(movies);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


