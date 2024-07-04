import type { MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { MoviePoster } from "~/components/MoviePoster";
import { loader } from "./loader.server";

export { loader };

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	// TODO: figure out why `data` can be `undefined`.
	const title = data?.movie.title;
	return [
		{
			title: `${title} - Movie`,
		},
		{
			name: "description",
			content: data?.movie.overview,
		},
	];
};

export default function Page() {
	const { movie } = useLoaderData<typeof loader>();
	return (
		<main className="flex min-h-svh flex-col items-center justify-center gap-8 p-8 lg:flex-row">
			<MoviePoster path={movie.poster_path} width={300} />
			<div className="max-w-xl">
				<h1 className="font-medium text-4xl">{movie.title}</h1>
				<ul
					role="list"
					aria-label="Genres"
					className="flex flex-wrap gap-2 pt-5"
				>
					{movie.genres.map((genre) => (
						<li
							key={genre.name}
							className="rounded bg-accent px-2 py-1 text-accent-content"
						>
							{genre.name}
						</li>
					))}
				</ul>
				<p className="pt-8">{movie.overview}</p>
			</div>
		</main>
	);
}
