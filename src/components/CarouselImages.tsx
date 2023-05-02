import { useFade } from "../lib/hooks";

interface ImageDataProps {
	images: string[];
}

export default function CarouselImages({ images }: ImageDataProps) {
	const [isVisible, counter] = useFade(true);
	return (
		<div
			className="background"
			style={{
				backgroundImage: `url(${images[counter]})`,
				animation: `${isVisible ? "fadeIn" : "fadeOut"} 1s`,
			}}
		/>
	);
}
