import { ChangeEvent, useState, useMemo } from "react";
import { getPercent } from "./getProgressPercent";

interface InitialVal {
	fileName: string;
	description: string;
}

type ReturnType = [
	value: InitialVal,
	setInputVal: React.Dispatch<React.SetStateAction<InitialVal>>,
	onChange: (e: ChangeEvent<HTMLInputElement>) => void,
	resetInput: () => void,
];

export const useInput = (initialValue: InitialVal): ReturnType => {
	const [inputVal, setInputVal] = useState(initialValue);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { value, id } = e.target;
		if (id === "name")
			setInputVal(prevState => {
				return {
					...prevState,
					fileName: value,
				};
			});
		else if (id === "description")
			setInputVal(prevState => {
				return { ...prevState, description: value };
			});
	};

	return [inputVal, setInputVal, handleChange, () => setInputVal(initialValue)];
};

export const useStartProgress = (filesize: number | undefined) => {
	const [progressPercent, setProgressPercent] = useState(0);
	useMemo(() => {
		var intervalId: any;
		const keepProgressing = (percent: number) => {
			intervalId = setTimeout(() => {
				setProgressPercent(percent);
			}, 5000);
		};
		if (filesize) {
			let sizeInBits = filesize * 8; //convert bytes into bits
			let remainingDataSize = sizeInBits - (progressPercent / 100) * sizeInBits; //get the remaining data on each iteration to calculate the remaining percentage of data transfer
			const percentVal: number | void = getPercent(remainingDataSize);
			if (percentVal) {
				progressPercent === 100 ? clearTimeout(intervalId) : keepProgressing(percentVal);
			}
		}
	}, [progressPercent, filesize]);

	return progressPercent;
};

export const useFade = (initial: boolean): [isVisible: boolean, counter: number] => {
	const [isVisible, setIsVisible] = useState(initial);
	const [counter, setCounter] = useState(0);

	useMemo(() => {
		let visibleIntervalId: any;
		let notVisibleIntervalId: any;
		clearTimeout(visibleIntervalId);
		clearTimeout(notVisibleIntervalId);
		if (isVisible) {
			visibleIntervalId = setTimeout(() => {
				setIsVisible(!isVisible);
			}, 6000);
		}

		if (!isVisible) {
			notVisibleIntervalId = setTimeout(() => {
				setIsVisible(true);
				counter !== 2
					? setCounter(prevState => {
							return (prevState += 1);
					  })
					: setCounter(0);
			}, 900);
		}
	}, [isVisible, counter]);
	return [isVisible, counter];
};
