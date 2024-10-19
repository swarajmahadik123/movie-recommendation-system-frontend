// src/pages/api/recommend.js

export default async function handler(req, res) {
  const { title } = req.query;

  // Proxy request to the Flask backend
  const response = await fetch(
    `http://127.0.0.1:5000/recommend?title=${title}`
  );
  const data = await response.json();

  res.status(200).json(data);
}
