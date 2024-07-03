import type { AppLoadContext, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { parse } from "valibot";
import { SearchResultSchema } from "./schema";

export async function loader({ context, request }: LoaderFunctionArgs) {
	const url = new URL(request.url);
	const query = url.searchParams.get("query");
	const page = url.searchParams.get("page") || "1";

	if (!query) {
		return { searchResult: null };
	}

	const searchResult = await search(context, query, page);
	return { searchResult };
}

async function search(context: AppLoadContext, query: string, page: string) {
	const url = new URL("https://api.themoviedb.org/3/search/movie");
	url.searchParams.set("query", query);
	url.searchParams.set("page", page);

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.cloudflare.env.TMDB_TOKEN}`,
		},
	});

	if (!response.ok) {
		throw response;
	}

	const json: unknown = await response.json();
	return parse(SearchResultSchema, json);
}
