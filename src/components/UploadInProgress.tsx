import ProgressBar from "../components/Progress";
import { fileSizeSerializer } from "../lib/serializers";
import { calculateTotalSize } from "../lib/fileSize";
import "../component-styles/Upload-Progress.css";

interface Props {
	files: File[] | [];
	progressState: string;
	downloadPageUrl: string | null;
	uploadError: boolean;
}

export default function UploadInProgress({
	files,
	progressState,
	downloadPageUrl,
	uploadError,
}: Props) {
	return (
		<div className="upload-progress-container">
			<section className="progress-section">
				{!downloadPageUrl ? (
					<ProgressBar
						filesize={calculateTotalSize(files)}
						progressState={progressState}
						uploadError={uploadError}
					/>
				) : (
					<div className="winner-img-wrapper">
						<img
							src="/winner.png"
							width="60%"
							height="60%"
							alt="winner"
						/>
					</div>
				)}
			</section>
			<section className="uploading-status-section">
				{downloadPageUrl ? (
					<div>
						<h2>You're done!</h2>
						<div className="file-upload-details">
							{files.length !== 0 && <p>Total Files: {files.length}</p>}
							{files.length !== 0 && (
								<p>Total size: {fileSizeSerializer(calculateTotalSize(files))}</p>
							)}
						</div>
						<div className="download-page-url-container">
							<div className="download-page-url-wrapper">
								<p>{downloadPageUrl}</p>
							</div>
						</div>
						<div className="copy-link-btn-wrapper">
							<button
								onClick={() => {
									navigator.clipboard.writeText(downloadPageUrl);
								}}>
								Copy link
							</button>
							<p>
								<a
									className="back-to-home"
									href="/">
									Send more files?
								</a>
							</p>
						</div>
						<p className="link-expiry-warning">
							*The download link will expire in 7days
						</p>
					</div>
				) : (
					<div>
						<h2 style={{ color: uploadError ? "red" : "black" }}>
							{!uploadError ? "Uploading..." : "Upload Error!"}
						</h2>
						<div className="file-upload-details">
							{files.length !== 0 && <p>Total Files: {files.length}</p>}
							{files.length !== 0 && (
								<p>Total size: {fileSizeSerializer(calculateTotalSize(files))}</p>
							)}
						</div>
						<div className="download-page-url-container" />
						<div className="copy-link-btn-wrapper">
							{!uploadError ? (
								<button disabled>Copy link</button>
							) : (
								<p>
									<a
										className="back-to-home"
										style={{ fontSize: "1rem" }}
										href="/">
										Try again?
									</a>
								</p>
							)}
						</div>
					</div>
				)}
			</section>
		</div>
	);
}
