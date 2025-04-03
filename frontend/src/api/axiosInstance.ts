import axios from "axios";

const API = axios.create({
  baseURL: "http://3.7.31.1:8080/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
