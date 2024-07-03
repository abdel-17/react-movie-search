import type { LoaderFunctionArgs } from "@remix-run/node";
import { parse } from "valibot";
import { TMDB_TOKEN } from "~/utils/env.server";
import { MovieDetailsSchema } from "./schema";

export async function loader({ params }: LoaderFunctionArgs) {
	// biome-ignore lint/style/noNonNullAssertion: `params.id` is guaranteed to exist in this route
	const id = params.id!;
	const movie = await getMovie(id);
	return { movie };
}

async function getMovie(id: string) {
	const response = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
		headers: {
			Authorization: `Bearer ${TMDB_TOKEN}`,
		},
	});

	if (!response.ok) {
		throw response;
	}

	const json: unknown = await response.json();
	return parse(MovieDetailsSchema, json);
}
