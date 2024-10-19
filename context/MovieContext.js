import { createContext, useContext, useState } from "react";

const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [movieRecommendations, setMovieRecommendations] = useState([]);

  return (
    <MovieContext.Provider
      value={{ movieRecommendations, setMovieRecommendations }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovieContext = () => {
  return useContext(MovieContext);
};
