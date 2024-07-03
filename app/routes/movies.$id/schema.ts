import {
	array,
	nullable,
	number,
	object,
	string,
	type InferOutput,
} from "valibot";

export const MovieDetailsSchema = object({
	id: number(),
	title: string(),
	poster_path: nullable(string()),
	overview: string(),
	genres: array(
		object({
			name: string(),
		}),
	),
});

export type MovieDetails = InferOutput<typeof MovieDetailsSchema>;
