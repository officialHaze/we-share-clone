import { useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { axiosInstance } from "../lib/axiosConfig";
import { decryptDownloadURL } from "../lib/encrypt_decrypt_data";
import UploadContainer from "../components/UploadContainer";
import "./Download.css";

export default function Download() {
	const { id, filename, filedesc } = useParams();
	const [downloadURL, setDownloadURL] = useState<string | null>(null);
	const [URLStatus, setURLStatus] = useState<number | null>(null);

	useMemo(() => {
		axiosInstance
			.get(`/api/file/download/${id}/`)
			.then(res => {
				const { data } = res;
				const url = decryptDownloadURL(data);
				res.status === 200 && url && setDownloadURL(url);
				res.status === 200 && setURLStatus(200);
				res.status === 403 && setURLStatus(403);
				res.status === 404 && setURLStatus(404);
			})
			.catch(err => {
				console.log(err);
			});
	}, [id]);

	return (
		<main className="download-page-main">
			<UploadContainer content={downloadURL}>
				<div className="container">
					<section className="file-status-section">
						<div
							className="circle"
							style={{
								background:
									URLStatus === 200
										? "rgba(122, 168, 116, 0.7)"
										: URLStatus === 403
										? "orange"
										: URLStatus === 404
										? "red"
										: "white",
							}}
						/>
						{URLStatus === 403 && <h2>Session expired! File is no longer available</h2>}
						{URLStatus === 404 && <h2>File not found!</h2>}
						{URLStatus === 200 && <h2>Your file is ready to download!</h2>}
					</section>
					<section>
						<div className="input-wrapper">
							<label
								className="input-label"
								htmlFor="name">
								File name
							</label>
							<input
								className="download-section-input"
								id="name"
								defaultValue={filename}
								type="text"
							/>
						</div>
						<div>
							<label
								className="input-label"
								htmlFor="desc">
								File description
							</label>
							<input
								className="download-section-input"
								id="desc"
								defaultValue={filedesc}
								type="text"
							/>
						</div>
					</section>
					<section className="download-btn-wrapper">
						{downloadURL ? (
							<button className="download-btn">
								<a href={downloadURL}>Download file</a>
							</button>
						) : (
							<button
								className="download-btn"
								disabled>
								<p>Download file</p>
							</button>
						)}
					</section>
				</div>
			</UploadContainer>
		</main>
	);
}
