import { ReactNode } from "react";
import "../App.css";

interface Props {
	children: ReactNode;
	content: string | undefined | null | File[] | [];
}

export default function UploadContainer({ children, content }: Props) {
	return (
		<div
			className="upload-container"
			style={{
				justifyContent: content?.length !== 0 ? "space-between" : "center",
			}}>
			{children}
		</div>
	);
}
