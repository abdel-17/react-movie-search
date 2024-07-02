import { object, pipe, string, transform, type InferOutput } from "valibot";

export const MovieDetailsSchema = pipe(
	object({
		imdbID: string(),
		Title: string(),
		Poster: string(),
		Type: string(),
		Plot: string(),
	}),
	transform((show) => ({
		id: show.imdbID,
		title: show.Title,
		poster: show.Poster,
		type: show.Type,
		plot: show.Plot,
	})),
);

export type MovieDetails = InferOutput<typeof MovieDetailsSchema>;
