import {
	array,
	nullable,
	number,
	object,
	string,
	type InferOutput,
} from "valibot";

export const SearchResultSchema = object({
	page: number(),
	results: array(
		object({
			id: number(),
			title: string(),
			poster_path: nullable(string()),
		}),
	),
	total_pages: number(),
	total_results: number(),
});

export type SearchResult = InferOutput<typeof SearchResultSchema>;
