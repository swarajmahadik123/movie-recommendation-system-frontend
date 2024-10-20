"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader2, Search, X } from "lucide-react";
import { useMovieContext } from "../../context/MovieContext";

export default function MovieRecommendations() {
  const [title, setTitle] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();

  const { movieRecommendations, setMovieRecommendations } = useMovieContext();

  const tmdbBearerToken = process.env.NEXT_PUBLIC_TMDB_BEARER_TOKEN;
  const tmdbApiBaseUrl = process.env.NEXT_PUBLIC_TMDB_API_BASE_URL;

  useEffect(() => {
    if (movieRecommendations.length === 0) {
      fetchInitialRecommendations();
    }
  }, []);

  useEffect(() => {
    if (errorMessage) {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
        setErrorMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const fetchInitialRecommendations = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${tmdbApiBaseUrl}/movie/top_rated?language=en-US&page=1`,
        {
          headers: {
            accept: "application/json",
            Authorization: tmdbBearerToken,
          },
        }
      );
      const topMovies = response.data.results.slice(0, 20);
      const detailedMovies = await Promise.all(
        topMovies.map(async (movie) => {
          const detailsResponse = await axios.get(
            `${tmdbApiBaseUrl}/movie/${movie.id}?language=en-US`,
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
      setErrorMessage(
        "Failed to fetch initial recommendations. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestions = async (searchText) => {
    try {
      const response = await axios.get(
        `${tmdbApiBaseUrl}/search/movie?query=${searchText}&language=en-US&page=1`,
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
      setErrorMessage("Failed to fetch suggestions. Please try again.");
    }
  };

  const fetchRecommendations = async () => {
    if (!title.trim()) {
      setErrorMessage("Please enter a movie title.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(""); // Reset error message on new search
    setSuggestions([]); // Clear the suggestions list
    try {
      const response = await axios.get(`/api/recommend?title=${title}`);

      // Log the response data to see its structure
      console.log("Recommendations response:", response.data);

      if (response.status === 404) {
        setErrorMessage(response.data.error || "Movie not found.");
        setMovieRecommendations([]);
        return;
      }

      const data = response.data;

      if (Array.isArray(data) && data.length > 0) {
        await fetchMovieDetails(data);
      } else {
        setErrorMessage("No recommendations found for this movie.");
        setMovieRecommendations([]);
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setErrorMessage(
        error.response?.data?.error ||
          "An error occurred while fetching recommendations."
      );
      setMovieRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMovieDetails = async (movies) => {
    try {
      const detailsPromises = movies.map(async (movie) => {
        const [movieTitle, movieId] = movie;
        const response = await axios.get(
          `${tmdbApiBaseUrl}/movie/${movieId}?language=en-US`,
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
      setErrorMessage("Failed to fetch movie details. Please try again.");
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
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 relative">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center">
        Movie Recommendations
      </h1>
      <div className="max-w-xl mx-auto mb-6 sm:mb-8">
        <div className="relative flex flex-col sm:flex-row items-center">
          <input
            type="text"
            value={title}
            onChange={handleInputChange}
            placeholder="Enter movie title"
            className="w-full px-4 py-2 mb-2 sm:mb-0 bg-gray-800 text-white border border-gray-700 rounded-md sm:rounded-r-none focus:outline-none focus:border-red-500"
          />
          <button
            onClick={fetchRecommendations}
            className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md sm:rounded-l-none flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
            ) : (
              <Search className="h-5 w-5 mr-2" />
            )}
            <span>{isLoading ? "Searching..." : "Search"}</span>
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
      {movieRecommendations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {movieRecommendations.map((movie, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200 cursor-pointer"
              onClick={() => router.push(`/movie/${movie.details.id}`)}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.details.poster_path}`}
                alt={movie.title}
                className="w-full h-auto"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold truncate">
                  {movie.title}
                </h3>
                <p className="text-sm text-gray-400">
                  {movie.details.release_date}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center mt-4 text-red-400">{errorMessage}</p>
      )}
      {showToast && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-full shadow-lg">
          <span>{errorMessage}</span>
          <button
            onClick={() => setShowToast(false)}
            className="absolute top-0 right-0 m-2"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
