import type { LoaderFunctionArgs } from "@remix-run/node";
import { parse } from "valibot";
import { OMDB_API_KEY } from "~/utils/env.server";
import { SearchResultSchema, type SearchResult } from "./schema";

export async function loader({ request }: LoaderFunctionArgs) {
	const url = new URL(request.url);
	const query = url.searchParams.get("query");
	const page = parseInt(url.searchParams.get("page") || "1", 10);

	if (!query) {
		return { searchResult: null };
	}

	// The API returns 20 results per page, so we fetch two pages at a time.
	const [first, second] = await Promise.all([
		search(query, 2 * page),
		search(query, 2 * page + 1),
	]);

	return {
		searchResult: mergeSearchResults(first, second),
	};
}

async function search(query: string, page: number) {
	const url = new URL("https://www.omdbapi.com/");
	url.searchParams.set("apikey", OMDB_API_KEY);
	url.searchParams.set("s", query);
	url.searchParams.set("page", page.toString());

	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to fetch search results: ${response.status}`);
	}

	const json: unknown = await response.json();
	return parse(SearchResultSchema, json);
}

function mergeSearchResults(a: SearchResult, b: SearchResult): SearchResult {
	if (!a.success || !b.success) {
		return a;
	}

	return {
		movies: [...a.movies, ...b.movies],
		totalCount: Math.ceil(a.totalCount / 2),
		success: true,
	};
}
