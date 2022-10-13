import axios from "axios";
import jwt_decode from "jwt-decode";
import { saveToken } from "./token";

const instance = axios.create({
  baseURL: "http://localhost:4000",
});

// Add a request interceptor
instance.interceptors.request.use(
  async function async(config) {
    const accessToken = localStorage.getItem("ACCESS_TOKEN");

    if (accessToken) {
      const decoded = jwt_decode(accessToken);
      // If access token expired
      if (decoded.exp < Date.now() / 1000) {
        console.log("run here");
        await getNewToken();
        localStorage.clear();
      }
    }
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

const getNewToken = async () => {
  const refreshToken = localStorage.getItem("REFRESH_TOKEN");
  const response = await axios.post("/token", {
    refreshToken,
  });
  console.log("newToken", response);
  if (response.body) {
    saveToken(response.body);
  }
};

export default instance;
