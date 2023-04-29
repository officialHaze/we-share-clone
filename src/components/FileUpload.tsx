import { ChangeEvent, FormEvent, useMemo } from "react";
import { axiosInstance } from "../lib/axiosConfig";
import { useInput } from "../lib/hooks";
import { RxCross2 } from "react-icons/rx";
import { fileSizeSerializer } from "../lib/serializers";
import { IoMdAdd } from "react-icons/io";
import { shortenURL } from "../lib/shortenURL";
import { encryptURL, encryptFileDetails } from "../lib/encrypt_decrypt_data";
import { calculateTotalSize, remainingSize } from "../lib/fileSize";
import JSZip from "jszip";

//create a zip instance
const zip = new JSZip();

const baseUrl = "http://localhost:3000";

interface Props {
	files: File[] | [];
	uploadFiles: React.Dispatch<React.SetStateAction<File[] | []>>;
	setHasProgressStarted: React.Dispatch<React.SetStateAction<boolean>>;
	hasProgressStarted: boolean;
	setProgressState: React.Dispatch<React.SetStateAction<string>>;
	LinkToDownloadPg: React.Dispatch<React.SetStateAction<string | null>>;
	uploadError: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FileUpload({
	files,
	uploadFiles,
	setHasProgressStarted,
	hasProgressStarted,
	setProgressState,
	LinkToDownloadPg,
	uploadError,
}: Props) {
	const [values, setInputValues, handleDetailChange, resetInput] = useInput({
		fileName: "",
		description: "",
	});

	//if user selects one file, keep the original file name as the title else keep the title blank
	useMemo(() => {
		if (files.length === 1) {
			setInputValues(prevState => {
				return {
					...prevState,
					fileName: files[0].name,
				};
			});
		} else if (files.length > 1) {
			setInputValues(prevState => {
				return {
					...prevState,
					fileName: "",
				};
			});
		}
	}, [files, setInputValues]);

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
		Array.from(files).forEach(file => {
			totalSize += file.size;
		});
		if (totalSize > 5000000000) {
			return "exceeded";
		}
		return "in-limit";
	};

	const handleUpload = async (e: FormEvent) => {
		e.preventDefault();
		resetInput();
		setHasProgressStarted(true);
		setProgressState("start");
		const zipFile = await handleCompress();
		const { encFileName, encFileDesc, encFile, nonce } = encryptFileDetails(
			zipFile,
			values.fileName,
			values.description,
		);

		const formData = new FormData();
		formData.append("file_name", encFileName);
		formData.append("file_desc", encFileDesc);
		formData.append("file", encFile);
		formData.append("nonce", nonce);
		try {
			const res = await axiosInstance.post("/api/file/upload/", formData); //send a request to the server only when file is available
			if (res) {
				const id: number = res.data.id;
				const fileDesc = values.description
					? values.description
					: "No description for this file";

				const encryptedURL = encryptURL(
					`${baseUrl}/download/${values.fileName}/${fileDesc}/${id.toString()}`,
				);
				const shortURLId = await shortenURL(encryptedURL);
				LinkToDownloadPg(`${process.env.REACT_APP_AXIOS_BASE_URL}/${shortURLId}/`);
			}
			setProgressState("end");
		} catch (err) {
			console.log(err);
			uploadError(true);
			setProgressState("error");
		}
		removeFile(null);
	};

	//compress teh files/file and convert it into a zip file
	const handleCompress = async () => {
		//taking the file state
		if (files.length !== 0) {
			files.forEach(file => {
				zip.file(file.name, file);
			});
		}
		const content = await zip.generateAsync({ type: "base64" });
		return content;
	};

	const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target;
		if (files) {
			const status = checkFileSize(files);
			if (status !== "exceeded") {
				Array.from(files).forEach((file, i) => {
					uploadFiles(prevState => {
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
							<div
								className="file-details"
								key={i}>
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
						<p>Total Size: {fileSizeSerializer(calculateTotalSize(files))}</p>
						<p>
							{fileSizeSerializer(
								remainingSize(calculateTotalSize(files), 500000000),
							)}{" "}
							remaining
						</p>
					</div>
				</section>
			)}
			<form
				className="form"
				onSubmit={handleUpload}>
				<section className="file-upload-section">
					<label
						className="file-input-label"
						htmlFor="file-input">
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
						<input
							id="description"
							value={values.description}
							onChange={handleDetailChange}
							type="text"
							placeholder="Description"
							required
						/>
					</div>
				</section>
				<section className="file-upload-btn-section">
					{!hasProgressStarted ? (
						<button
							className="file-upload-btn"
							type="submit">
							Get a link
						</button>
					) : (
						<button
							disabled
							className="file-upload-btn"
							type="submit">
							Get a link
						</button>
					)}
				</section>
			</form>
		</>
	);
}

// handleInput.value.fileName
// 	? handleInput.value.fileName
// 	: files.length === 1
// 	? files[0].name
// 	: "";
