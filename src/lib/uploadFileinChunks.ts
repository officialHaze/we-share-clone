import sendFormData from "../lib/sendFormData";
import { fileToUint8Array } from "../lib/convertFilesToUint8Array";
import { encryptFileDetails } from "../lib/encrypt_decrypt_data";
import { deleteLocalData } from "./localData";

interface CachedUploadData {
	file: {
		name: string;
		offset: number;
	};
	fileIndex: number | null;
	title: string;
	desc: string;
}

export default async function uploadFileInChunks(
	files: File[],
	setUploadedSize: React.Dispatch<React.SetStateAction<number[]>>,
	cachedData: CachedUploadData,
): Promise<number> {
	let _newCachedData = { ...cachedData };
	let fileId = 0;
	let maxChunkSize = 5 * 1024 * 1024; //5 MB
	let completeStatus: string;
	return new Promise(async (resolve, reject) => {
		try {
			for (let i = 0; i < files.length; i++) {
				const updateCachedData = {
					..._newCachedData,
					fileIndex: i,
				};
				localStorage.setItem("cached_upload_data", JSON.stringify(updateCachedData)); //update the cached data file index on each iteration
				const fileUint8Array = await fileToUint8Array(files[i]);
				let offset = _newCachedData.file.offset;
				while (offset < files[i].size) {
					const fileSize = files[i].size;
					const remainingSize = fileSize - offset;
					const _chunkSize = Math.min(remainingSize, maxChunkSize);
					const chunk = fileUint8Array.slice(offset, offset + _chunkSize);
					_newCachedData = {
						...updateCachedData,
						file: {
							name: files[i].name,
							offset: offset + chunk.length,
						},
					};
					localStorage.setItem("cached_upload_data", JSON.stringify(_newCachedData));
					// console.log(offset);
					const { encFileName, encZipName, encFileDesc, encFile, encNonce } =
						encryptFileDetails(
							chunk,
							files[i].name,
							_newCachedData.title,
							_newCachedData.desc,
						);
					if (fileSize - offset < maxChunkSize) {
						completeStatus = "complete";
					} else {
						completeStatus = "incomplete";
					}
					const { detail, id } = await sendFormData(
						encFileName,
						encZipName,
						encFileDesc,
						encFile, //original files data
						encNonce,
						completeStatus,
					);
					// _newCachedData = {
					// 	...updateCachedData,
					// 	file: {
					// 		name: files[i].name,
					// 		offset: offset,
					// 	},
					// };
					// localStorage.setItem("cached_upload_data", JSON.stringify(_newCachedData));
					fileId = id;
					setUploadedSize(prevState => {
						return [...prevState, chunk.length];
					});
					offset += chunk.length;
				}
				_newCachedData = {
					...updateCachedData,
					file: {
						name: files[i].name,
						offset: 0,
					},
				};
			}
			localStorage.removeItem("cached_upload_data");
			deleteLocalData();
			resolve(fileId);
		} catch (err) {
			reject(err);
		}
	});
}
