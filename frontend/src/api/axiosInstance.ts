import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:8080/api/v1",
  baseURL: "http://3.108.43.234/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
