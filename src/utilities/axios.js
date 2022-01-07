
import axios_base from "axios";
import backend from "../env";
import { showAlert } from "../common/Toast";

const axios = axios_base.create({
  baseURL: backend
});

axios.interceptors.response.use((response) => response, (error) => {
  if (localStorage.getItem("err") !== JSON.stringify(error)) {
    localStorage.setItem("err", JSON.stringify(error));
    if (error.response.status === 500) {
      showAlert(
        "Unexpected error occurred. Please contact us if you see this message repeatedly.",
        "error"
      );
    } else if (error.response.status === 401) {
      showAlert(
        "Authentication error. Please try clicking/tapping on the CollabConnect logo to re-authenticate",
        "error"
      );
    }
  }
  return Promise.reject(error);
});

export default axios;
