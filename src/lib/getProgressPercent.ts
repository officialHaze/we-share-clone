export const getPercent = (filesize: number, sizeUploaded: number) => {
	const sizeUploadedInPercent = (sizeUploaded / filesize) * 100;
	return parseInt(sizeUploadedInPercent.toFixed(2));
};
