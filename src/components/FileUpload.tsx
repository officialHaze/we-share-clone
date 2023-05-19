import { encryptURL, decryptURL } from "../lib/encrypt_decrypt_data";
import { calculateTotalSize, remainingSize } from "../lib/fileSize";
import { fileSizeSerializer } from "../lib/serializers";
import { ChangeEvent, FormEvent } from "react";
import { shortenURL } from "../lib/shortenURL";
import { RxCross2 } from "react-icons/rx";
import { IoMdAdd } from "react-icons/io";
import { v4 as uuidv4 } from "uuid";
import {
  storeLocalData,
  deleteLocalData,
  retrieveLocalData,
} from "../lib/localData";
import uploadFileInChunks from "../lib/uploadFileinChunks";

// const baseUrl = "http://localhost:3000";
const baseUrl = "https://seol.moi-e.in";

interface CachedUploadData {
  file: {
    name: string;
    offset: number;
  };
  fileIndex: number;
  title: string;
  desc: string;
}

interface InitialVal {
  fileName: string;
  description: string;
}

interface Props {
  files: File[] | [];
  uploadFiles: React.Dispatch<React.SetStateAction<File[] | []>>;
  setHasProgressStarted: React.Dispatch<React.SetStateAction<boolean>>;
  setProgressState: React.Dispatch<React.SetStateAction<string>>;
  LinkToDownloadPg: React.Dispatch<React.SetStateAction<string | null>>;
  uploadError: React.Dispatch<React.SetStateAction<boolean>>;
  setUploadedSize: React.Dispatch<React.SetStateAction<number[]>>;
  toResumeUpload: boolean;
  cachedData: CachedUploadData | null;
  values: InitialVal;
  setInputValues: React.Dispatch<React.SetStateAction<InitialVal>>;
  handleDetailChange: (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => void;
}

export default function FileUpload({
  files,
  uploadFiles,
  setHasProgressStarted,
  setProgressState,
  LinkToDownloadPg,
  uploadError,
  setUploadedSize,
  toResumeUpload,
  cachedData,
  values,
  handleDetailChange,
}: Props) {
  //empty the filelist
  const removeFile = (i: number | null) => {
    if (i !== null) {
      const newFiles = files.filter((file, idx) => {
        return idx !== i;
      });
      uploadFiles(newFiles);
    } else {
      uploadFiles([]);
    }
  };

  //check file size before setting the state
  const checkFileSize = (files: FileList) => {
    let totalSize = 0;
    Array.from(files).forEach((file) => {
      totalSize += file.size;
    });
    if (totalSize > 500000000) {
      return "exceeded";
    }
    return "in-limit";
  };

  //handles normal upload without any interruption
  const normalUpload = async (randomId: string) => {
    try {
      const uploadDataObj = {
        file: {
          name: "",
          offset: 0,
        },
        fileIndex: null,
        title: `${values.fileName}_${randomId}`,
        desc: values.description,
      };
      const cachedFiles = await retrieveLocalData();
      const fileId = await uploadFileInChunks(
        cachedFiles,
        setUploadedSize,
        uploadDataObj
      );
      const fileDesc = values.description
        ? values.description
        : "No description for this file";

      const encryptedUrl = encryptURL(
        `${baseUrl}/download/${
          values.fileName
        }/${fileDesc}/${fileId.toString()}`
      ); //encrypt the download page url
      return encryptedUrl;
    } catch (err) {
      throw err;
    }
  };

  //handles upload after any interruption(resumes the upload)
  const resumeUpload = async (
    randomId: string,
    cachedData: CachedUploadData
  ) => {
    try {
      const cachedFileIdx = cachedData.fileIndex;

      const filteredFileList: File[] = [];
      files.forEach((file, i) => {
        if (i >= cachedFileIdx) filteredFileList.push(file);
      });

      console.log(filteredFileList);
      const fileId = await uploadFileInChunks(
        filteredFileList,
        setUploadedSize,
        cachedData
      );

      const fileDesc = cachedData.desc
        ? cachedData.desc
        : "No description for this file";

      const encryptedUrl = encryptURL(
        `${baseUrl}/download/${
          cachedData.title
        }/${fileDesc}/${fileId.toString()}`
      ); //encrypt the download page url
      return encryptedUrl;
    } catch (err) {
      throw err;
    }
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    let encryptedDownloadUrl: {
      encryptedURL: string;
      nonce: string;
    } = {
      encryptedURL: "",
      nonce: "",
    };
    setHasProgressStarted(true);
    setProgressState("start");
    const randomId = uuidv4();
    try {
      storeLocalData(files);
      if (!toResumeUpload) {
        encryptedDownloadUrl = await normalUpload(randomId);
      } else if (toResumeUpload && cachedData) {
        encryptedDownloadUrl = await resumeUpload(randomId, cachedData);
      }

      const { enc_short_url, nonce } = await shortenURL(encryptedDownloadUrl); //send a request to the server to shorten the long url
      const short_url = decryptURL(enc_short_url, nonce); //decrypt the url once received from the server
      LinkToDownloadPg(short_url);
      deleteLocalData();
      setProgressState("end");
    } catch (err) {
      console.error("Error while uploading", err);
      localStorage.removeItem("cached_upload_data");
      deleteLocalData();
      uploadError(true);
      setProgressState("error");
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      const status = checkFileSize(files);
      if (status !== "exceeded") {
        Array.from(files).forEach((file, i) => {
          uploadFiles((prevState) => {
            return [...prevState, file];
          });
        });
      }
    }
  };

  return (
    <>
      {files.length !== 0 && (
        <section className="file-details-section">
          {files.map((file, i) => {
            return (
              <div className="file-details" key={i}>
                <div>
                  <div>
                    <h4 style={{ fontSize: "0.9rem" }}>{file.name}</h4>
                  </div>
                  <div>
                    <p style={{ fontSize: "0.85rem" }}>
                      size: {fileSizeSerializer(file.size)}
                    </p>
                  </div>
                </div>
                <div className="file-remove-wrapper">
                  <RxCross2
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      removeFile(i);
                    }}
                  />
                </div>
              </div>
            );
          })}
          <div className="size-left-wrapper">
            <p>
              {files.length} {files.length > 1 ? "files" : "file"} selected
            </p>
            <p>
              {fileSizeSerializer(
                remainingSize(calculateTotalSize(files), 500000000)
              )}{" "}
              remaining
            </p>
          </div>
        </section>
      )}
      <form className="form" onSubmit={handleUpload}>
        {!toResumeUpload && (
          <section className="file-upload-section">
            <label className="file-input-label" htmlFor="file-input">
              <div className="add-file-btn">
                <IoMdAdd />
              </div>
              <input
                id="file-input"
                onChange={handleFileInputChange}
                type="file"
                value=""
                multiple
              />
            </label>
            <div className="file-upload-text-wrapper">
              <h3>
                Upload files
                <span>(max-size:500mb)</span>
              </h3>
            </div>
          </section>
        )}
        {!toResumeUpload && (
          <section>
            <div>
              <input
                id="name"
                value={values.fileName}
                onChange={handleDetailChange}
                type="text"
                placeholder="Title"
                required
              />
            </div>
            <div className="hr">
              <hr />
            </div>
            <div>
              <textarea
                id="description"
                value={values.description}
                onChange={handleDetailChange}
                placeholder="Description"
              />
            </div>
          </section>
        )}
        <section className="file-upload-btn-section">
          {!toResumeUpload ? (
            files.length !== 0 ? (
              <button className="file-upload-btn" type="submit">
                Get Transfer Link
              </button>
            ) : (
              <button disabled className="file-upload-btn" type="submit">
                Get Transfer Link
              </button>
            )
          ) : (
            <button className="file-upload-btn" type="submit">
              Resume Upload
            </button>
          )}
        </section>
      </form>
    </>
  );
}

// const uploadFilesInChunk = async (): Promise<number> => {
// 	let fileId = 0;
// 	let maxChunkSize = 5 * 1024 * 1024; //5 MB
// 	let completeStatus: string;
// 	const randomId = uuidv4();
// 	return new Promise(async (resolve, reject) => {
// 		try {
// 			for (const file of files) {
// 				const fileUint8Array = await fileToUint8Array(file);
// 				let offset = 0;
// 				while (offset < file.size) {
// 					const fileSize = file.size;
// 					const remainingSize = fileSize - offset;
// 					const _chunkSize = Math.min(remainingSize, maxChunkSize);
// 					const chunk = fileUint8Array.slice(offset, offset + _chunkSize);
// 					const { encFileName, encZipName, encFileDesc, encFile, encNonce } =
// 						encryptFileDetails(
// 							chunk,
// 							file.name,
// 							`${values.fileName}_${randomId}`,
// 							values.description,
// 						);
// 					if (fileSize - offset < maxChunkSize) {
// 						completeStatus = "complete";
// 					} else {
// 						completeStatus = "incomplete";
// 					}
// 					const { detail, id } = await sendFormData(
// 						encFileName,
// 						encZipName,
// 						encFileDesc,
// 						encFile, //original files data
// 						encNonce,
// 						completeStatus,
// 					);
// 					console.log(detail);
// 					fileId = id;
// 					setUploadedSize(prevState => {
// 						return [...prevState, chunk.length];
// 					});
// 					offset += chunk.length;
// 				}
// 			}
// 			resolve(fileId);
// 		} catch (err) {
// 			reject(err);
// 		}
// 	});
// };
