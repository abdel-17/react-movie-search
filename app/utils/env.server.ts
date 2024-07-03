function env(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Environment variable ${name} is missing`);
	}
	return value;
}

export const TMDB_TOKEN = env("TMDB_TOKEN");
