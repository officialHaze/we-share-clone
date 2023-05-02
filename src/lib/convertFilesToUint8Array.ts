export const fileToUint8Array = async (file: File): Promise<Uint8Array> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsArrayBuffer(file);
		reader.onload = () => {
			if (reader.result instanceof ArrayBuffer) {
				resolve(new Uint8Array(reader.result));
			} else {
				reject(new Error("Errow while reading the file"));
			}
		};
		reader.onerror = reject;
	});
};

export const fileArrayToUint8ArrayArray = async (fileArray: File[]) => {
	const uint8ArrayArray: Uint8Array[] = [];
	try {
		for (const file of fileArray) {
			const arrayBuffer: Uint8Array = await fileToUint8Array(file);
			uint8ArrayArray.push(arrayBuffer);
		}
		return uint8ArrayArray;
	} catch (err) {
		throw err;
	}
};
