import axios_base from "axios";
import backend from "../env";
import {isBrowser, setLoggedOut} from "./auth";
import {showAlert} from "../common/Toast";

const axios = axios_base.create({
	baseURL: backend
})

if (isBrowser() && sessionStorage.getItem("token"))
	axios.defaults.headers.common['Authorization'] = "Token " + sessionStorage.getItem("token");

export const setToken = (access_token) => {
	axios.defaults.headers.common['Authorization'] = "Token " + access_token;
	sessionStorage.setItem("token", access_token)
}

axios.interceptors.response.use(function (response) {
	return response;
}, function (error) {
	if (!isBrowser())
		throw error;
	if (localStorage.getItem("err") !== JSON.stringify(error)) {
		localStorage.setItem("err", JSON.stringify(error))
		if (error.response.status === 500)
			showAlert(
				"Unexpected error occurred. Please contact us if you see this message repeatedly.",
				"error"
			)
		else if (error.response.status === 401) {
			showAlert(
				"Authentication error",
				"error"
			)
			setLoggedOut()
		}
	}
	return Promise.reject(error);
});

export default axios
