import React, { useState, useEffect } from "react";
import styled from "styled-components";

const AppContainer = styled.div`
  font-family: Arial, sans-serif;
  display: flex;
  height: 100vh;
  width: 100%;
  gap: 200px;
  background-image: url('https://example.com/background.jpg');
  
`;

const LeftPanel = styled.div`
  width: 50%;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
`;

const FormContainer = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

const FilterContainer = styled.div`
  width: 100%;
  margin-top: 20px;
`;

const RightPanel = styled.div`
  width: 50%;
  overflow-y: auto;
  padding: 20px;
  border-left: 2px solid #ccc;
`;

const Header = styled.h1`
  color: greenyellow;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  border: 1px solid black;
  border-radius: 5px;
`;

const Button = styled.button`
  background-color: greenyellow;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  &:hover {
    background-color: #9acd32;
  }
`;

const MovieList = styled.div`
  margin-top: 30px;
`;

const MovieCard = styled.div`
  border: 1px solid #ccc;
  padding: 15px;
  margin: 10px 0;
  width: 100%;
  border-radius: 5px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const Rating = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
  cursor: pointer;

  span {
    font-size: 20px;
    color: gold;
  }
`;

function Movie() {
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    releaseYear: "",
    watch: false,
    rating: 0,
  });
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newMovie = {
      ...form,
      releaseYear: parseInt(form.releaseYear, 10),
    };

    try {
      const response = await fetch("http://localhost:5001/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMovie),
      });

      if (response.ok) {
        const data = await response.json();
        setMovies((prev) => [...prev, data]);
        setForm({ title: "", description: "", releaseYear: "", watch: false, rating: 0 });
      }
    } catch (error) {
      console.error("Error submitting the movie:", error);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const fetchMovies = async () => {
    try {
      let url = "http://localhost:5001/movies";
      if (searchQuery) {
        url = `http://localhost:5001/movie/search?q=${searchQuery}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const toggleWatchStatus = async (index) => {
    const updatedMovies = [...movies];
    updatedMovies[index].watch = !updatedMovies[index].watch;

    try {
      await fetch(`http://localhost:5001/movies/${updatedMovies[index]._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ watch: updatedMovies[index].watch }),
      });

      setMovies(updatedMovies);
    } catch (error) {
      console.error("Error updating watch status:", error);
    }
  };

  const setRating = async (index, rating) => {
    const updatedMovies = [...movies];
    updatedMovies[index].rating = rating;

    try {
      await fetch(`http://localhost:5001/movies/${updatedMovies[index]._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating }),
      });

      setMovies(updatedMovies);
    } catch (error) {
      console.error("Error updating rating:", error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [searchQuery]);

  const filteredMovies = movies.filter((movie) => {
    if (filter === "all") return true;
    return filter === "watched" ? movie.watch : !movie.watch;
  });

  return (
    <AppContainer>
      <LeftPanel>
        <FormContainer>
          <Header>Movie WatchList</Header>
          <p>Welcome to your WatchList</p>
          <Form onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              placeholder="Enter Title"
              value={form.title}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="description"
              placeholder="Enter Description"
              value={form.description}
              onChange={handleChange}
            />
            <input
              type="number"
              name="releaseYear"
              placeholder="Enter Release Year"
              value={form.releaseYear}
              onChange={handleChange}
            />
            <label>
              <input
                type="checkbox"
                name="watch"
                checked={form.watch}
                onChange={handleChange}
              />
              Watched
            </label>
            <Button type="submit">Submit</Button>
          </Form>
        </FormContainer>

        <FilterContainer>
          <SearchContainer>
            <input
              type="text"
              placeholder="Search Movies..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Button onClick={fetchMovies}>Search</Button>
          </SearchContainer>

          <label>
            Filter by:
            <select value={filter} onChange={handleFilterChange}>
              <option value="all">All Movies</option>
              <option value="watched">Watched</option>
              <option value="not-watched">Not Watched</option>
            </select>
          </label>
        </FilterContainer>
      </LeftPanel>

      <RightPanel>
        <MovieList>
          <h2>Movie List</h2>
          {filteredMovies.map((movie, index) => (
            <MovieCard key={index}>
              <strong>Title:</strong> {movie.title} <br />
              <strong>Description:</strong> {movie.description} <br />
              <strong>Release Year:</strong> {movie.releaseYear} <br />
              <strong>Watched:</strong>
              <Button onClick={() => toggleWatchStatus(index)}>
                {movie.watch ? "Yes" : "No"}
              </Button>
              <Rating>
                <strong>Rating:</strong>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRating(index, star)}
                  >
                    {star <= movie.rating ? "★" : "☆"}
                  </span>
                ))}
              </Rating>
            </MovieCard>
          ))}
        </MovieList>
      </RightPanel>
    </AppContainer>
  );
}

export default Movie;
