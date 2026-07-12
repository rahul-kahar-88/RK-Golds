import axios from "axios";

const API = axios.create({
  baseURL: "https://rk-golds.onrender.com/",
});

export default API;