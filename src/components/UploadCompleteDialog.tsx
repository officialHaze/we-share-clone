import "../component-styles/UploadCompleteDialog.css";
import { fileSizeSerializer } from "../lib/serializers";
import { calculateTotalSize } from "../lib/fileSize";
import { GiCrossMark } from "react-icons/gi";
import { useState, useMemo } from "react";

interface Props {
	downloadPageLink: string | null;
	totalFilesUploaded: number;
	allFiles: File[];
	removeFiles: React.Dispatch<React.SetStateAction<File[] | []>>;
}

export default function UploadCompleteDialog({
	downloadPageLink,
	totalFilesUploaded,
	allFiles,
	removeFiles,
}: Props) {
	const [isDialogHidden, hideDialog] = useState(true);
	useMemo(() => {
		downloadPageLink && hideDialog(false);
	}, [downloadPageLink]);

	return (
		<div
			className="completion-dialog-box"
			style={{
				transform: isDialogHidden ? "translateX(100%)" : "translateX(0)",
			}}>
			<div style={{ padding: "1rem 1.5rem", cursor: "pointer" }}>
				<h2>
					<GiCrossMark
						onClick={() => {
							removeFiles([]);
							hideDialog(true);
						}}
					/>
				</h2>
			</div>
			<div className="upload-details-container">
				<div className="total-files-uploaded">
					<p>Total files uploaded</p>
					<ul>
						<li>{totalFilesUploaded}</li>
					</ul>
				</div>
				<div className="all-files">
					<p>Files</p>
					<ul>
						{allFiles.map((file, i) => {
							return <li key={i}>{file.name}</li>;
						})}
					</ul>
				</div>
				<div className="file-sizes">
					<p>Size</p>
					<ul>
						{allFiles.map((file, i) => {
							return <li key={i}>{fileSizeSerializer(file.size)}</li>;
						})}
					</ul>
				</div>
				<div className="total-size-uploaded">
					<p>Total size</p>
					<ul>
						<li>{fileSizeSerializer(calculateTotalSize(allFiles))}</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
