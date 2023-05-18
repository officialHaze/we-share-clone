import "../component-styles/UploadCompleteDialog.css";
import { fileSizeSerializer } from "../lib/serializers";
import { calculateTotalSize } from "../lib/fileSize";
import { BsDot } from "react-icons/bs";
import { RxCrossCircled } from "react-icons/rx";
import { useState, useMemo } from "react";
import Footer from "./Footer";

interface InitialVal {
  fileName: string;
  description: string;
}

interface Props {
  downloadPageLink: string | null;
  totalFilesUploaded: number;
  allFiles: File[];
  removeFiles: React.Dispatch<React.SetStateAction<File[] | []>>;
  inputValues: InitialVal;
  resetInputValues: () => void;
}

export default function UploadCompleteDialog({
  downloadPageLink,
  totalFilesUploaded,
  allFiles,
  removeFiles,
  inputValues,
  resetInputValues,
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
      }}
    >
      <div
        style={{
          padding: "1rem 1.5rem",
          cursor: "pointer",
          borderBottom: "1px solid rgba(122, 122, 122, 0.3)",
          opacity: 0.35,
        }}
      >
        <h2>
          <RxCrossCircled
            onClick={() => {
              resetInputValues();
              removeFiles([]);
              hideDialog(true);
            }}
          />
        </h2>
      </div>
      <div className="transfer-details-heading">
        <div>
          <h1>Your transfer details</h1>
          <div className="transfer-details-subheading">
            <p>
              {totalFilesUploaded} {totalFilesUploaded > 1 ? "files" : "file"}{" "}
              <BsDot /> {fileSizeSerializer(calculateTotalSize(allFiles))}{" "}
              <BsDot />{" "}
              {allFiles.length !== 0
                ? "Expires in 20 days"
                : "No files uploaded to set expiry"}
            </p>
          </div>
        </div>
      </div>
      <div className="upload-details-container">
        <div className="file-details-wrapper">
          <div className="file-title-desc">
            <div className="title-container">
              <h4>Title</h4>
              <p style={{ padding: "1rem 0" }}>{inputValues.fileName}</p>
            </div>
            <div className="desc-container">
              <h4>Description</h4>
              <p style={{ padding: "1rem 0" }}>{inputValues.description}</p>
            </div>
          </div>
          <div className="files-uploaded-container">
            <h4>
              {totalFilesUploaded} {totalFilesUploaded > 1 ? "Files" : "File"}
            </h4>
            <ul>
              {allFiles.map((file, i) => {
                return (
                  <li key={i} className="files-uploaded">
                    <p>{file.name}</p>
                    <p style={{ color: "rgba(122, 122, 122,0.9)" }}>
                      {fileSizeSerializer(file.size)}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
