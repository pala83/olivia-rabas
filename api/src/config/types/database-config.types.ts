/** libsql connection settings: a `file:` URL for local SQLite or a `libsql://` URL for Turso. */
export type DatabaseConfig = {
	url: string;
	authToken?: string;
};

export type Env = Record<string, string | undefined>;
