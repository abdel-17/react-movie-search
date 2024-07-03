import placeholder from "~/assets/placeholder.svg";

export function MoviePoster({
	path,
	size,
}: {
	path: string | null;
	size: "w500" | "original";
}) {
	return (
		<img
			src={
				path !== null
					? `https://image.tmdb.org/t/p/${size}${path}`
					: placeholder
			}
			alt=""
			data-placeholder={path === null ? true : undefined}
			className="aspect-[2/3] data-[placeholder]:bg-neutral data-[placeholder]:p-10"
		/>
	);
}
