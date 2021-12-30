import axios from "axios";
import cookie from "react-cookies";
export default axios.create({
  baseURL: "https://socketizers.herokuapp.com",
  headers: {
    Authorization: `Bearer ${cookie.load("token")}`,
  },
});
