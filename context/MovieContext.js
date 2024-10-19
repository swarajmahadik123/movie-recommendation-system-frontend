import { createContext, useContext, useState } from "react";

// Create the context
const MovieContext = createContext();

// Custom hook to use the MovieContext
export const useMovieContext = () => useContext(MovieContext);

// Provide the context to your app
export function MovieProvider({ children }) {
  const [movieRecommendations, setMovieRecommendations] = useState([]);

  return (
    <MovieContext.Provider
      value={{ movieRecommendations, setMovieRecommendations }}
    >
      {children}
    </MovieContext.Provider>
  );
}
