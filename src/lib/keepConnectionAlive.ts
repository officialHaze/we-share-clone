import { axiosInstance } from "./axiosConfig";

export default function keepConnectionAlive() {
	const sendConnectionStreams = async () => {
		const { data } = await axiosInstance.get("");
		console.log(data);
	};
	const intervalPeriod = 10000 * 10;
	setInterval(sendConnectionStreams, intervalPeriod);
}
