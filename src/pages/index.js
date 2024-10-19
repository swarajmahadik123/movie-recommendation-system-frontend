import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MovieRecommendations from "../components/MovieRecommendations";

const Home = () => {
  return (
    <div>
      <MovieRecommendations />
      <Footer />
    </div>
  );
};

export default Home;
