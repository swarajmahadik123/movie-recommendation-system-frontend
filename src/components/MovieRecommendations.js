"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader2, Search } from "lucide-react";
import { useMovieContext } from "../../context/MovieContext";

const tmdbBearerToken =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MTE2M2NkMmIwZTgzOGIwNTQyYTU0M2FlZTFhNjY4YSIsIm5iZiI6MTcyOTMzNjQzNC43OTUzNjUsInN1YiI6IjY3MTM5MTU1ZDViNzkyNmU5NDZmYWQzNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.45mcsu-gZ-1GidrjLJacOvieuFjZlwk3g2JB56nAtcI";

export default function MovieRecommendations() {
  const [title, setTitle] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { movieRecommendations, setMovieRecommendations } = useMovieContext();

  useEffect(() => {
    if (movieRecommendations.length === 0) {
      fetchInitialRecommendations();
    }
  }, []);

  const fetchInitialRecommendations = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1",
        {
          headers: {
            accept: "application/json",
            Authorization: tmdbBearerToken,
          },
        }
      );
      const topMovies = response.data.results.slice(0, 5);
      const detailedMovies = await Promise.all(
        topMovies.map(async (movie) => {
          const detailsResponse = await axios.get(
            `https://api.themoviedb.org/3/movie/${movie.id}?language=en-US`,
            {
              headers: {
                accept: "application/json",
                Authorization: tmdbBearerToken,
              },
            }
          );
          return { title: movie.title, details: detailsResponse.data };
        })
      );
      setMovieRecommendations(detailedMovies);
    } catch (error) {
      console.error("Error fetching initial recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestions = async (searchText) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?query=${searchText}&language=en-US&page=1`,
        {
          headers: {
            accept: "application/json",
            Authorization: tmdbBearerToken,
          },
        }
      );
      setSuggestions(response.data.results.slice(0, 5));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/recommend?title=${title}`);
      const data = response.data;
      await fetchMovieDetails(data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMovieDetails = async (movies) => {
    try {
      const detailsPromises = movies.map(async (movie) => {
        const [movieTitle, movieId] = movie;
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
          {
            headers: {
              accept: "application/json",
              Authorization: tmdbBearerToken,
            },
          }
        );
        return { title: movieTitle, details: response.data };
      });
      const resolvedDetails = await Promise.all(detailsPromises);
      setMovieRecommendations(resolvedDetails);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  const handleInputChange = (e) => {
    const searchText = e.target.value;
    setTitle(searchText);
    if (searchText.length > 1) {
      fetchSuggestions(searchText);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setTitle(suggestion.title);
    setSuggestions([]);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Movie Recommendations
      </h1>
      <div className="max-w-xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            value={title}
            onChange={handleInputChange}
            placeholder="Enter movie title"
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:border-red-500"
          />
          <button
            onClick={fetchRecommendations}
            className="absolute right-0 top-0 h-full px-4 bg-red-600 hover:bg-red-700 text-white rounded-r-md flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <Search className="h-5 w-5" />
            )}
            <span className="ml-2">
              {isLoading ? "Searching..." : "Search"}
            </span>
          </button>
        </div>
        {suggestions.length > 0 && (
          <ul className="mt-2 bg-gray-800 rounded-md overflow-hidden">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              >
                {suggestion.title}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movieRecommendations.map((movie) => (
          <div
            key={movie.details.id}
            className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200 cursor-pointer"
            onClick={() => router.push(`/movie/${movie.details.id}`)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.details.poster_path}`}
              alt={movie.title}
              className="w-full h-auto"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold truncate">{movie.title}</h3>
              <p className="text-sm text-gray-400">
                {movie.details.release_date.split("-")[0]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
