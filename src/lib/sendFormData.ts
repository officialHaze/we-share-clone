import { axiosInstance } from "./axiosConfig";

interface Response {
  data: {
    detail: string;
    id: number;
    current_offset: number;
  };
}

export default async function sendFormData(
  encFileName: string,
  encZipName: string,
  encFileDesc: string,
  encFile: string,
  encOffsetVal: string,
  nonce: string,
  completeStatus: string
) {
  const formData = new FormData();
  formData.append("file_name", encFileName);
  formData.append("zip_name", encZipName);
  formData.append("file_desc", encFileDesc);
  formData.append("file", encFile);
  formData.append("offset_val", encOffsetVal);
  formData.append("nonce", nonce);
  formData.append("complete_status", completeStatus);

  try {
    const { data }: Response = await axiosInstance.post(
      "/api/file/upload/",
      formData
    );
    return data;
  } catch (err) {
    throw err;
  }
}
