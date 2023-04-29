export const calculateTotalSize = (files: File[]) => {
	let totalSize = 0;
	files.forEach(file => {
		totalSize += file.size;
	});
	return totalSize;
};

export const remainingSize = (totalSize: number, fixedSize: number) => {
	const remainingSize = fixedSize - totalSize;
	return remainingSize <= 0 ? 0 : remainingSize;
};
