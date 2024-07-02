import { useLoaderData } from "@remix-run/react";
import { loader } from "./loader.server";

export { loader };

export default function Page() {
	const { movie } = useLoaderData<typeof loader>();
	return (
		<main className="flex min-h-svh flex-col items-center justify-center gap-8 p-8 sm:flex-row">
			<img src={movie.poster} alt="" className="aspect-[2/3] w-[250px]" />
			<div className="max-w-xl">
				<h1 className="text-3xl font-medium">{movie.title}</h1>
				<div className="mt-4 w-fit rounded bg-accent p-1.5 text-accent-content">
					{movie.type}
				</div>
				<p className="mt-8">{movie.plot}</p>
			</div>
		</main>
	);
}
