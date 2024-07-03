import {
	type InferOutput,
	array,
	nullable,
	number,
	object,
	string,
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
	total_results: number(),
});

export type SearchResult = InferOutput<typeof SearchResultSchema>;
