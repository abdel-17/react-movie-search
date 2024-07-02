import {
	array,
	object,
	pipe,
	string,
	transform,
	union,
	type InferOutput,
} from "valibot";

const SearchResultSuccessSchema = pipe(
	object({
		Search: array(
			object({
				imdbID: string(),
				Title: string(),
				Poster: string(),
				Type: string(),
			}),
		),
		totalResults: string(),
	}),
	transform((results) => ({
		movies: results.Search.map((movie) => ({
			id: movie.imdbID,
			title: movie.Title,
			poster: movie.Poster,
			type: movie.Type,
		})),
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
