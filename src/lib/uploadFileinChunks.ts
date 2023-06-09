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
  cachedData: CachedUploadData
): Promise<number> {
  let _newCachedData = { ...cachedData };
  let fileId = 0;
  let maxChunkSize = 5 * 1024 * 1024; //5 MB
  let completeStatus: string;
  let index = 0;
  return new Promise(async (resolve, reject) => {
    try {
      for (let file of files) {
        const updateCachedData = {
          ..._newCachedData,
          fileIndex: index,
        };
        localStorage.setItem(
          "cached_upload_data",
          JSON.stringify(updateCachedData)
        ); //update the cached data file index on each iteration
        const fileUint8Array = await fileToUint8Array(file);
        let offset = _newCachedData.file.offset;
        while (offset < file.size) {
          const fileSize = file.size;
          const remainingSize = fileSize - offset;
          const _chunkSize = Math.min(remainingSize, maxChunkSize);
          const chunk = fileUint8Array.slice(offset, offset + _chunkSize);
          _newCachedData = {
            ...updateCachedData,
            file: {
              name: file.name,
              offset: offset,
            },
          };
          localStorage.setItem(
            "cached_upload_data",
            JSON.stringify(_newCachedData)
          );
          const { encFileName, encZipName, encFileDesc, encFile, encNonce } =
            encryptFileDetails(
              chunk,
              file.name,
              _newCachedData.title,
              _newCachedData.desc,
              offset.toString()
            );
          if (remainingSize < maxChunkSize) {
            completeStatus = "complete";
          } else {
            completeStatus = "incomplete";
          }
          const { id } = await sendFormData(
            encFileName,
            encZipName,
            encFileDesc,
            encFile, //original files data
            encNonce,
            completeStatus
          );
          // increase the offset vale by 1 and cache it after receiving a proper response from the server
          _newCachedData = {
            ...updateCachedData,
            file: {
              name: file.name,
              offset: offset + chunk.length,
            },
          };
          localStorage.setItem(
            "cached_upload_data",
            JSON.stringify(_newCachedData)
          );

          fileId = id;
          setUploadedSize((prevState) => {
            return [...prevState, chunk.length];
          });
          offset += chunk.length;
        }
        _newCachedData = {
          ...updateCachedData,
          file: {
            name: file.name,
            offset: 0,
          },
        };
        index += 1;
      }
      localStorage.removeItem("cached_upload_data");
      deleteLocalData();
      resolve(fileId);
    } catch (err) {
      reject(err);
    }
  });
}
