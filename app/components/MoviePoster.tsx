import placeholder from "~/assets/placeholder.svg";

export function MoviePoster({
	path,
	width,
}: {
	path: string | null;
	width: number;
}) {
	return (
		<img
			src={
				path !== null ? `https://image.tmdb.org/t/p/w500${path}` : placeholder
			}
			alt=""
			data-placeholder={path === null ? true : undefined}
			className="aspect-[2/3] data-[placeholder]:bg-neutral data-[placeholder]:p-10"
			style={{
				width: `${width}px`,
			}}
		/>
	);
}
