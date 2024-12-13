import React, { useState, useEffect } from "react";
import styled from "styled-components";

const AppContainer = styled.div`
  font-family: Arial, sans-serif;
  display: flex;
  height: 100vh;
  width: 100%;
  gap: 20px; /* Add gap between left and right panels */
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
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

function Movie() {
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    releaseYear: "",
    watch: false,
  });
  const [filter, setFilter] = useState("all"); // Filter state
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

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
      const response = await fetch("http://localhost:5000/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMovie),
      });

      if (response.ok) {
        const data = await response.json();
        setMovies((prev) => [...prev, data]);
        setForm({ title: "", description: "", releaseYear: "", watch: false });
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
      let url = "http://localhost:5000/movies";
      if (searchQuery) {
        url = `http://localhost:5000/movie/search?q=${searchQuery}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const filteredMovies = movies.filter((movie) => {
    if (filter === "all") return true;
    return filter === "watched" ? movie.watch : !movie.watch;
  });

  useEffect(() => {
    fetchMovies();
  }, [searchQuery]);

  return (
    <AppContainer>
      {/* Left Panel */}
      <LeftPanel>
        {/* Form Container */}
        <FormContainer>
          <Header>IMDB</Header>
          <p>Welcome to IMDB</p>
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

        {/* Filter/Search Container */}
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

      {/* Right Panel (Movie List) */}
      <RightPanel>
        <MovieList>
          <h2>Movie List</h2>
          {filteredMovies.map((movie, index) => (
            <MovieCard key={index}>
              <strong>Title:</strong> {movie.title} <br />
              <strong>Description:</strong> {movie.description} <br />
              <strong>Release Year:</strong> {movie.releaseYear} <br />
              <strong>Watched:</strong> {movie.watch ? "Yes" : "No"}
            </MovieCard>
          ))}
        </MovieList>
      </RightPanel>
    </AppContainer>
  );
}

export default Movie;
