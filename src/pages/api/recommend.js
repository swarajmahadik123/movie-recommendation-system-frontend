export default async function handler(req, res) {
  const { title } = req.query;

  // Use the Flask API base URL from environment variables
  const flaskApiBaseUrl = process.env.NEXT_PUBLIC_FLASK_API_BASE_URL;

  try {
    // Proxy request to the Flask backend
    const response = await fetch(`${flaskApiBaseUrl}/recommend?title=${title}`);
    const data = await response.json();

    if (response.ok) {
      res.status(200).json(data);
    } else {
      res
        .status(response.status)
        .json({ error: data.error || "Error fetching recommendations." });
    }
  } catch (error) {
    console.error("Error proxying request to Flask backend:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
