export default function removeExtension(fileName: string) {
	let latestDotPos: number;
	let nameWithoutExtension = "";
	//loop through every char, get the latest position of any dot and extract the string before that
	for (let i = 0; i < fileName.length; i++) {
		if (fileName[i] === ".") {
			latestDotPos = i;
			nameWithoutExtension = fileName.substring(0, latestDotPos);
		}
	}
	return nameWithoutExtension;
}
