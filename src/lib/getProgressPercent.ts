interface NavigatorWithConnection extends Navigator {
	connection?: {
		downlink?: number;
		effectiveType?: string;
		onchange?: () => void;
		rtt?: number;
	};
}

export const getPercent = (size: number) => {
	const nav: NavigatorWithConnection = navigator;
	if (nav.connection) {
		const { downlink } = nav.connection;
		if (downlink) {
			const bps = Math.round(downlink) * 1000000 * 8; //convert mbps into bps
			const dataTransfer = Math.round(bps) / Math.round(size);
			if (dataTransfer >= 1) {
				return 99;
			} else {
				return parseFloat((dataTransfer * 100).toFixed(2)); //return the remaining percentage of data transfer
			}
		}
		console.log("connection lost");
	}
};
