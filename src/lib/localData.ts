export const storeLocalData = (files: File[]) => {
	const dbName = "cachedFileData";
	const storeName = "files";
	// Open a connection to the database
	const request = indexedDB.open(dbName);

	request.onerror = event => {
		console.error("Database error:", (event.target as IDBOpenDBRequest).error);
	};
	request.onupgradeneeded = event => {
		// Create the object store
		const db = (event.target as IDBOpenDBRequest).result;
		const objectStore = db.createObjectStore(storeName, { keyPath: "name" });
		// console.log(objectStore);
	};

	request.onsuccess = function (event) {
		// Store the files in the object store
		const db = (event.target as IDBOpenDBRequest).result;
		const transaction = db.transaction([storeName], "readwrite");
		const objectStore = transaction.objectStore(storeName);

		files.forEach(file => {
			objectStore.add(file);
		});

		transaction.oncomplete = function (event) {
			console.log("Files stored successfully");
		};

		transaction.onerror = function (event) {
			console.error("Transaction error:", (event.target as IDBOpenDBRequest).error);
		};
	};
};

export const retrieveLocalData = (): Promise<File[]> => {
	return new Promise((resolve, reject) => {
		const dbName = "cachedFileData";
		const storeName = "files";
		// Open a connection to the database
		const request = indexedDB.open(dbName);

		request.onerror = event => {
			console.error("Database error:", (event.target as IDBOpenDBRequest).error);
			reject((event.target as IDBOpenDBRequest).error);
		};

		request.onsuccess = function (event) {
			// Retrieve the files from the object store
			const db = (event.target as IDBOpenDBRequest).result;
			const transaction = db.transaction([storeName], "readonly");
			const objectStore = transaction.objectStore(storeName);

			const getAllRequest = objectStore.getAll();

			getAllRequest.onerror = function (event) {
				console.error("Get all error:", (event.target as IDBRequest).error);
				reject((event.target as IDBOpenDBRequest).error);
			};

			getAllRequest.onsuccess = function (event) {
				const files = (event.target as IDBRequest).result;
				// console.log("Files retrieved successfully:", files);
				resolve(files);
			};

			transaction.onerror = function (event) {
				console.error("Transaction error:", (event.target as IDBTransaction).error);
				reject((event.target as IDBOpenDBRequest).error);
			};
		};
	});
};

export const deleteLocalData = () => {
	const dbName = "cachedFileData";
	const storeName = "files";
	// Open a connection to the database
	const request = indexedDB.open(dbName);

	request.onerror = event => {
		console.error("Database error:", (event.target as IDBOpenDBRequest).error);
	};

	request.onsuccess = function (event) {
		// Store the files in the object store
		const db = (event.target as IDBOpenDBRequest).result;
		const transaction = db.transaction([storeName], "readwrite");
		const objectStore = transaction.objectStore(storeName);

		const clearRequest = objectStore.clear();

		clearRequest.onsuccess = function (event) {
			console.log("All data deleted");
		};

		clearRequest.onerror = function (event) {
			console.error("Clear error:", (event.target as IDBOpenDBRequest).error);
		};

		transaction.onerror = function (event) {
			console.error("Transaction error:", (event.target as IDBOpenDBRequest).error);
		};
	};
};
