export const fileSizeSerializer = (size: number) => {
	if (size < 1000) {
		return size.toString() + " bytes";
	} else if (size >= 1000 && size < Math.pow(1000, 2)) {
		const kb = Math.round(size / 1024);
		return kb.toString() + " kb";
	} else if (size >= Math.pow(1000, 2)) {
		const mb = Math.round(size / Math.pow(1024, 2));
		return mb.toString() + " mb";
	}
};
