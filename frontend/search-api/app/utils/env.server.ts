function env(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Environment variable ${name} is missing`);
	}
	return value;
}

export const OMDB_API_KEY = env("OMDB_API_KEY");
