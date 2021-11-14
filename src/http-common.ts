import axios from "axios";

export default axios.create({
  baseURL: "https://api.hci.realliance.net",
  headers: {
    "Content-type": "application/json",
  },
});
