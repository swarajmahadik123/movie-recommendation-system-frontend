"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { ArrowLeft, Star, Clock, Calendar } from "lucide-react";

const tmdbBearerToken =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MTE2M2NkMmIwZTgzOGIwNTQyYTU0M2FlZTFhNjY4YSIsIm5iZiI6MTcyOTMzNjQzNC43OTUzNjUsInN1YiI6IjY3MTM5MTU1ZDViNzkyNmU5NDZmYWQzNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.45mcsu-gZ-1GidrjLJacOvieuFjZlwk3g2JB56nAtcI";

export default function MovieDetails() {
  const [movie, setMovie] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (id) {
        try {
          const response = await axios.get(
            `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
            {
              headers: {
                accept: "application/json",
                Authorization: tmdbBearerToken,
              },
            }
          );
          setMovie(response.data);
        } catch (error) {
          console.error("Error fetching movie details:", error);
        }
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (!movie) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div
        className="relative h-[50vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 bg-gray-900 bg-opacity-50 hover:bg-opacity-75 text-white px-4 py-2 rounded-full flex items-center transition duration-300"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-64 h-auto rounded-lg shadow-lg"
          />
          <div>
            <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
            <p className="text-gray-400 mb-4 italic">{movie.tagline}</p>
            <div className="flex items-center mb-4 space-x-4">
              <div className="flex items-center">
                <Star className="text-yellow-400 mr-1 h-5 w-5" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="text-gray-400 mr-1 h-5 w-5" />
                <span>{new Date(movie.release_date).getFullYear()}</span>
              </div>
              <div className="flex items-center">
                <Clock className="text-gray-400 mr-1 h-5 w-5" />
                <span>{movie.runtime} min</span>
              </div>
            </div>
            <p className="text-lg mb-4">{movie.overview}</p>
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Genres</h2>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="bg-red-600 px-3 py-1 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
