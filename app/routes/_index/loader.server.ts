import type { LoaderFunctionArgs } from "@remix-run/node";
import { parse } from "valibot";
import { TMDB_TOKEN } from "~/utils/env.server";
import { SearchResultSchema } from "./schema";

export async function loader({ request }: LoaderFunctionArgs) {
	const url = new URL(request.url);
	const query = url.searchParams.get("query");
	const page = url.searchParams.get("page") || "1";

	if (!query) {
		return { searchResult: null };
	}

	const searchResult = await search(query, page);
	return { searchResult };
}

async function search(query: string, page: string) {
	const url = new URL("https://api.themoviedb.org/3/search/movie");
	url.searchParams.set("query", query);
	url.searchParams.set("page", page);

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${TMDB_TOKEN}`,
		},
	});

	if (!response.ok) {
		throw response;
	}

	const json: unknown = await response.json();
	return parse(SearchResultSchema, json);
}
