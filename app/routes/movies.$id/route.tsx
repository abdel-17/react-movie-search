import { useLoaderData } from "@remix-run/react";
import { MoviePoster } from "~/components/MoviePoster";
import { loader } from "./loader.server";

export { loader };

export default function Page() {
	const { movie } = useLoaderData<typeof loader>();
	return (
		<main className="flex min-h-svh flex-col items-center justify-center gap-8 p-8 sm:flex-row">
			<div className="w-[300px]">
				<MoviePoster path={movie.poster_path} size="original" />
			</div>
			<div className="max-w-xl">
				<h1 className="text-3xl font-medium">{movie.title}</h1>
				<ul role="list" aria-label="Genres" className="mt-4 flex gap-2">
					{movie.genres.map((genre) => (
						<li
							key={genre.name}
							className="rounded bg-accent p-1.5 text-accent-content"
						>
							{genre.name}
						</li>
					))}
				</ul>
				<p className="mt-8">{movie.overview}</p>
			</div>
		</main>
	);
}
