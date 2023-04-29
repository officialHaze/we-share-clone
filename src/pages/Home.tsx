import { useState } from "react";
import { useFade } from "../lib/hooks";
import FileUpload from "../components/FileUpload";
import UploadInProgress from "../components/UploadInProgress";
import UploadContainer from "../components/UploadContainer";
import "../App.css";

const images = [
	"https://wallpapercrafter.com/desktop/14129-architecture-construction-bw-branches-4k.jpg",
	"https://wallpapercrafter.com/sizes/3840x2160/221902-tree-b-and-w-black-and-white-and-blackandwhite-hd.jpg",
	"https://wallpaperaccess.com/full/539662.jpg",
];

export default function Home() {
	const [files, uploadFiles] = useState<File[] | []>([]);
	const [downloadPagelink, setDownloadPageLink] = useState<string | null>(null);
	const [progressState, setProgressState] = useState("");
	const [hasProgressStarted, setHasProgressStarted] = useState(false);
	const [uploadError, setUploadError] = useState(false);

	const [isVisible, counter] = useFade(true);

	const fileUploadProps = {
		files: files,
		uploadFiles: uploadFiles,
		setHasProgressStarted: setHasProgressStarted,
		hasProgressStarted: hasProgressStarted,
		setProgressState: setProgressState,
		LinkToDownloadPg: setDownloadPageLink,
		uploadError: setUploadError,
	};

	const uploadProgressProps = {
		files: files,
		progressState: progressState,
		downloadPageUrl: downloadPagelink,
		uploadError: uploadError,
	};

	return (
		<div className="main">
			<div
				className="background"
				style={{
					backgroundImage: `url(${images[counter]})`,
					animation: `${isVisible ? "fadeIn" : "fadeOut"} 1s`,
				}}
			/>
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
