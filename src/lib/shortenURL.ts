import { axiosInstance } from "./axiosConfig";

interface Parameter {
	encryptedURL: string;
	nonce: string;
}

export const shortenURL = async (encryptedData: Parameter) => {
	try {
		const { data } = await axiosInstance.post("/api/file/shorten_url/", encryptedData);
		return data.hashed_id;
	} catch (err) {
		console.log(err);
	}
};
