import React from "react";
import "../../globle.css";
import { MovieProvider } from "../../context/MovieContext";

function MyApp({ Component, pageProps }) {
  return (
    <MovieProvider>
      <Component {...pageProps} />
    </MovieProvider>
  );
}

export default MyApp;
