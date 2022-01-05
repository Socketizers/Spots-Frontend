import axios from "axios";
import cookie from "react-cookies";
let cancel = null;
let token = cookie.load("token");
export default axios.create({
  baseURL: "https://socketizers.herokuapp.com",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  cancelToken: new axios.CancelToken((c) => {
    cancel = c;
    if (cookie.load("token") === undefined) {
      cancel();
      token = cookie.load("token");
    }
  }),
});
