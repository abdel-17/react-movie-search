import {
	array,
	object,
	pipe,
	string,
	transform,
	union,
	type InferOutput,
} from "valibot";

export const MovieSchema = pipe(
	object({
		imdbID: string(),
		Title: string(),
		Poster: string(),
		Type: string(),
	}),
	transform((show) => ({
		id: show.imdbID,
		title: show.Title,
		poster: show.Poster,
		type: show.Type,
	})),
);

const SearchResultSuccessSchema = pipe(
	object({
		Search: array(MovieSchema),
		totalResults: string(),
	}),
	transform((results) => ({
		movies: results.Search,
		totalCount: parseInt(results.totalResults, 10),
		success: true as const,
	})),
);

const SearchResultErrorSchema = pipe(
	object({
		Error: string(),
	}),
	transform((result) => ({
		error: result.Error,
		success: false as const,
	})),
);

export const SearchResultSchema = union([
	SearchResultSuccessSchema,
	SearchResultErrorSchema,
]);

export type SearchResult = InferOutput<typeof SearchResultSchema>;
