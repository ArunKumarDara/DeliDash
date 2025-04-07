import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:8080/api/v1",
  baseURL: "http://52.66.152.76/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
