import type { LoaderFunctionArgs } from "@remix-run/node";
import { parse } from "valibot";
import { OMDB_API_KEY } from "~/utils/env.server";
import { MovieDetailsSchema } from "./schema";

export async function loader({ params }: LoaderFunctionArgs) {
	const id = params.id!;
	const movie = await getMovie(id);
	return { movie };
}

async function getMovie(id: string) {
	const url = new URL("https://www.omdbapi.com/");
	url.searchParams.set("apikey", OMDB_API_KEY);
	url.searchParams.set("i", id);

	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(
			`Failed to fetch movie with id ${id}: ${response.statusText}`,
		);
	}

	const json: unknown = await response.json();
	return parse(MovieDetailsSchema, json);
}
