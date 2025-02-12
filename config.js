export const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5173/" // Base URL for local development
    : import.meta.env.VITE_API_URL; // Base URL from .env in production
