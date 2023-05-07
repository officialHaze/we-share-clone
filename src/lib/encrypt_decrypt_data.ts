import nacl from "tweetnacl";
import util, { encodeUTF8 } from "tweetnacl-util";

type EncryptionResult = {
	encFileName: string;
	encZipName: string;
	encFileDesc: string;
	encFile: string;
	encOffsetVal: string;
	encNonce: string;
};

const encodeBase64 = util.encodeBase64;
const decodeBase64 = util.decodeBase64;
//random nonce of 24 bytes buffer
const nonce = nacl.randomBytes(24);

const encryptionKey = process.env.REACT_APP_ENCRYPTION_KEY;

//secret_key of 32 bytes buffer
const secretKey = new Uint8Array(32);
encryptionKey && secretKey.set(util.decodeUTF8(encryptionKey));

//encrypt file details
export const encryptFileDetails = (
	file: Uint8Array,
	filename: string,
	zipname: string,
	filedesc: string,
	offset: string,
): EncryptionResult => {
	//decode the file from base64 encoded format into Uint8array
	// const decodedFile = decodeBase64(file);
	const encrypted_file = nacl.secretbox(file, nonce, secretKey);

	//decode the filename and filedesc string into Uint8array
	const decodedFilename = util.decodeUTF8(filename);
	const decodedFiledesc = util.decodeUTF8(filedesc);
	const decodedZipName = util.decodeUTF8(zipname);
	const decodedOffsetVal = util.decodeUTF8(offset);

	const encrypted_name = nacl.secretbox(decodedFilename, nonce, secretKey);
	const encrypted_zip_name = nacl.secretbox(decodedZipName, nonce, secretKey);
	const encrypted_desc = nacl.secretbox(decodedFiledesc, nonce, secretKey);
	const encrypted_offset_val = nacl.secretbox(decodedOffsetVal, nonce, secretKey);

	return {
		encFileName: encodeBase64(encrypted_name),
		encZipName: encodeBase64(encrypted_zip_name),
		encFileDesc: encodeBase64(encrypted_desc),
		encFile: encodeBase64(encrypted_file),
		encOffsetVal: encodeBase64(encrypted_offset_val),
		encNonce: encodeBase64(nonce),
	};
};

// //encrypt file details
// export const encryptFileDetails = (
// 	filedata: string,
// 	filename: string,
// 	filedesc: string,
// ): EncryptionResult => {
// 	// //decode the files from base64 encoded format into Uint8array
// 	// const decodedFile = decodeBase64(file);
// 	// const encrypted_file = nacl.secretbox(decodedFile, nonce, secretKey);

// 	//get each file and encrypt them
// 	const decoded_file_data = util.decodeUTF8(filedata);
// 	const encrypted_file_data = nacl.secretbox(decoded_file_data, nonce, secretKey);

// 	//decode the filename and filedesc string into Uint8array
// 	const decodedFilename = util.decodeUTF8(filename);
// 	const decodedFiledesc = util.decodeUTF8(filedesc);

// 	const encrypted_name = nacl.secretbox(decodedFilename, nonce, secretKey);
// 	const encrypted_desc = nacl.secretbox(decodedFiledesc, nonce, secretKey);

// 	return {
// 		encFileName: encodeBase64(encrypted_name),
// 		encFileDesc: encodeBase64(encrypted_desc),
// 		encFile: encodeBase64(encrypted_file_data),
// 		encNonce: encodeBase64(nonce),
// 	};
// };

export const encryptURL = (url: string) => {
	//convert the string into Uint8Array buffer
	const decodedURL = util.decodeUTF8(url);

	const encryptedURL = nacl.secretbox(decodedURL, nonce, secretKey);

	return {
		encryptedURL: encodeBase64(encryptedURL),
		nonce: encodeBase64(nonce),
	};
};

//decryption
export const decryptURL = (url: string, nonce: string) => {
	const decryptionKey = process.env.REACT_APP_DECRYPTION_KEY;
	const decoded_decryptKey = decryptionKey ? util.decodeUTF8(decryptionKey) : util.decodeUTF8("");

	const b64Decoded_url = decodeBase64(url);
	const b64Decoded_nonce = decodeBase64(nonce);

	const decrypted_url = nacl.secretbox.open(b64Decoded_url, b64Decoded_nonce, decoded_decryptKey);

	return decrypted_url ? encodeUTF8(decrypted_url) : null;
};
