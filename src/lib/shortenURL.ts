import { axiosInstance } from "./axiosConfig";

interface Parameter {
	encryptedURL: string;
	nonce: string;
}

interface Response {
	data: {
		enc_short_url: string;
		nonce: string;
	};
}

export const shortenURL = async (encryptedData: Parameter) => {
	try {
		const { data }: Response = await axiosInstance.post(
			"/api/file/shorten_url/",
			encryptedData,
		);
		return data;
	} catch (err) {
		throw err;
	}
};
