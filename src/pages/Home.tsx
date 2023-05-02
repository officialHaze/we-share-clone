import { useState } from "react";
import FileUpload from "../components/FileUpload";
import UploadInProgress from "../components/UploadInProgress";
import UploadContainer from "../components/UploadContainer";
import CarouselImages from "../components/CarouselImages";
import { images } from "../lib/imageData";
import "../App.css";

export default function Home() {
	const [files, uploadFiles] = useState<File[] | []>([]);
	const [downloadPagelink, setDownloadPageLink] = useState<string | null>(null);
	const [progressState, setProgressState] = useState("");
	const [hasProgressStarted, setHasProgressStarted] = useState(false);
	const [uploadError, setUploadError] = useState(false);
	const [uploadedFileSizes, setUploadedFileSizes] = useState([0]);

	const fileUploadProps = {
		files: files,
		uploadFiles: uploadFiles,
		setHasProgressStarted: setHasProgressStarted,
		hasProgressStarted: hasProgressStarted,
		setProgressState: setProgressState,
		LinkToDownloadPg: setDownloadPageLink,
		uploadError: setUploadError,
		setUploadedSize: setUploadedFileSizes,
	};

	const uploadProgressProps = {
		files: files,
		progressState: progressState,
		downloadPageUrl: downloadPagelink,
		uploadError: uploadError,
		uploadedSizes: uploadedFileSizes,
	};

	return (
		<div className="main">
			<CarouselImages images={images} />
			<UploadContainer content={files}>
				{hasProgressStarted ? (
					<UploadInProgress {...uploadProgressProps} />
				) : (
					<FileUpload {...fileUploadProps} />
				)}
			</UploadContainer>
		</div>
	);
}
