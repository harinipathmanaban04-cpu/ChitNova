import axios from "axios";

const configuredUrl = import.meta.env.VITE_API_URL?.trim();
const browserHost = typeof window !== "undefined" ? window.location.hostname : "localhost";

// When opened from a phone/tablet, localhost points to the phone itself.
// Use the same computer hostname/IP that served Vite, with the API on port 5000.
const isLocalConfiguredUrl = configuredUrl && /localhost|127\.0\.0\.1/.test(configuredUrl);
const baseURL = configuredUrl && !isLocalConfiguredUrl
  ? configuredUrl.replace(/\/$/, "")
  : `http://${browserHost}:5000/api`;

const api = axios.create({
  baseURL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("chitnova_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
