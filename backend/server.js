const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Movie } = require("./models/movie.js");

const app = express();
const PORT = 5001;

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

app.put("/movies/:id", async (req, res) => {
  const { id } = req.params;
  const { watch, rating } = req.body;

  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      { watch, rating },
      { new: true } // To return the updated movie
    );
    if (!updatedMovie) {
      return res.status(404).send("Movie not found");
    }
    res.json(updatedMovie);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// Update the movie's "watched" status
app.patch("/movies/:id", async (req, res) => {
  const { id } = req.params;
  const { watch } = req.body; // The updated "watched" status

  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      { watch },
      { new: true } // Return the updated document
    );

    if (!updatedMovie) {
      return res.status(404).send("Movie not found");
    }

    res.json(updatedMovie);
  } catch (err) {
    res.status(500).send(err.message);
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


