import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:3000/api/v1", //will need to update to using
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000, // 10 seconds
});

// Optional: Add interceptors for logging, auth, etc.
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API error:", error);
        return Promise.reject(error);
    },
);

export default axiosClient;
