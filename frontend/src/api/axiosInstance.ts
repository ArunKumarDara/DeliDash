import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:8080/api/v1",
  baseURL: "http://65.2.3.224:8080/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
