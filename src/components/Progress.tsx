import { useStartProgress } from "../lib/hooks";
import "../component-styles/Progress-Bar.css";

interface ProgressProps {
	currentPercent: number;
}

interface ProgressBarProps {
	progressState: string;
	filesize: number | undefined;
	uploadError: boolean;
}

export const StartProgress = ({ currentPercent }: ProgressProps) => {
	return (
		<div
			className="percentage-val-container"
			style={{ position: "relative" }}>
			<h2>{currentPercent}%</h2>
		</div>
	);
};

export const EndProgress = () => {
	return (
		<div
			className="percentage-val-container"
			style={{ position: "relative" }}>
			<h2>100%</h2>
		</div>
	);
};

export const UploadError = () => {
	return (
		<div
			className="percentage-val-container"
			style={{ position: "relative" }}>
			<h2 style={{ color: "red" }}>!</h2>
		</div>
	);
};

export default function ProgressBar({ progressState, filesize, uploadError }: ProgressBarProps) {
	const progressPercent = useStartProgress(filesize);

	return (
		<section className="bar-container">
			<div
				className="circular-progress"
				style={{
					background:
						progressState === "start"
							? `conic-gradient(#5454c5 ${progressPercent}%, rgba(122, 122, 122, 0.3) 0deg)`
							: progressState === "end"
							? "conic-gradient(#5454c5 100%, rgba(122, 122, 122, 0.3) 0deg)"
							: "conic-gradient(red 100%, rgba(122, 122, 122, 0.3) 0deg)",
				}}>
				{progressState === "start" && <StartProgress currentPercent={progressPercent} />}
				{progressState === "end" && <EndProgress />}
				{uploadError && <UploadError />}
			</div>
		</section>
	);
}
