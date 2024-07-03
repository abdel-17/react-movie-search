import type { AppLoadContext, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { parse } from "valibot";
import { MovieDetailsSchema } from "./schema";

export async function loader({ context, params }: LoaderFunctionArgs) {
	// biome-ignore lint/style/noNonNullAssertion: `params.id` is guaranteed to exist in this route
	const id = params.id!;
	const movie = await getMovie(context, id);
	return { movie };
}

async function getMovie(context: AppLoadContext, id: string) {
	const response = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
		headers: {
			Authorization: `Bearer ${context.cloudflare.env.TMDB_TOKEN}`,
		},
	});

	if (!response.ok) {
		throw response;
	}

	const json: unknown = await response.json();
	return parse(MovieDetailsSchema, json);
}
