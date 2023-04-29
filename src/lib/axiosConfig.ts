import axios from "axios";

const adminToken = process.env.REACT_APP_ADMIN_TOKEN;

export const axiosInstance = axios.create({
	baseURL: process.env.REACT_APP_AXIOS_BASE_URL,
	headers: {
		"admin-token": adminToken,
	},
	// timeout: 9000,
});
