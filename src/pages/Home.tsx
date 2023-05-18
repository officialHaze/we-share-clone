import { useState, useEffect, useMemo } from "react";
import FileUpload from "../components/FileUpload";
import UploadInProgress from "../components/UploadInProgress";
import UploadContainer from "../components/UploadContainer";
import CarouselImages from "../components/CarouselImages";
import { images } from "../lib/imageData";
import Navbar from "../components/Navbar";
import UploadCompleteDialog from "../components/UploadCompleteDialog";
import { retrieveLocalData } from "../lib/localData";
import { useInput } from "../lib/hooks";
import removeExtension from "../lib/removeFileExtension";
import "../App.css";

interface CachedUploadData {
  file: {
    name: string;
    offset: number;
  };
  fileIndex: number;
  title: string;
  desc: string;
}

export default function Home() {
  const [files, uploadFiles] = useState<File[] | []>([]);
  const [downloadPagelink, setDownloadPageLink] = useState<string | null>(null);
  const [progressState, setProgressState] = useState("");
  const [hasProgressStarted, setHasProgressStarted] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [uploadedFileSizes, setUploadedFileSizes] = useState([0]);
  const [toResumeUpload, resumeUploading] = useState(false);
  const [cachedData, setCachedData] = useState<CachedUploadData | null>(null);
  const [values, setInputValues, handleDetailChange, resetInput] = useInput({
    fileName: "",
    description: "",
  });

  //if user selects one file, keep the original file name as the title else keep the title blank
  useMemo(() => {
    if (files.length === 1) {
      setInputValues((prevState) => {
        return {
          ...prevState,
          fileName: removeExtension(files[0].name),
        };
      });
    } else if (files.length > 1) {
      setInputValues((prevState) => {
        return {
          ...prevState,
          fileName: "",
        };
      });
    }
  }, [files, setInputValues]);

  useEffect(() => {
    const cachedData = localStorage.getItem("cached_upload_data");
    if (cachedData) {
      setCachedData(JSON.parse(cachedData));
      resumeUploading(true);
    }
  }, []);

  useMemo(() => {
    if (toResumeUpload && cachedData) {
      let files: File[] = [];
      setUploadedFileSizes((prevState) => {
        return [...prevState, cachedData.file.offset];
      });
      const fileList = async () => {
        files = await retrieveLocalData();
        uploadFiles(files);
      };
      fileList();
    }
  }, [toResumeUpload, cachedData]);

  const fileUploadProps = {
    files: files,
    uploadFiles: uploadFiles,
    setHasProgressStarted: setHasProgressStarted,
    setProgressState: setProgressState,
    LinkToDownloadPg: setDownloadPageLink,
    uploadError: setUploadError,
    setUploadedSize: setUploadedFileSizes,
    toResumeUpload: toResumeUpload,
    cachedData: cachedData,
    values: values,
    setInputValues: setInputValues,
    handleDetailChange: handleDetailChange,
  };

  const uploadProgressProps = {
    files: files,
    progressState: progressState,
    downloadPageUrl: downloadPagelink,
    uploadError: uploadError,
    uploadedSizes: uploadedFileSizes,
  };

  const uploadCompleteDialogProps = {
    downloadPageLink: downloadPagelink,
    totalFilesUploaded: files.length,
    allFiles: files,
    removeFiles: uploadFiles,
    inputValues: values,
    resetInputValues: resetInput,
  };

  return (
    <div className="main">
      <CarouselImages images={images} />
      {progressState !== "start" && <Navbar />}
      <UploadCompleteDialog {...uploadCompleteDialogProps} />
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
