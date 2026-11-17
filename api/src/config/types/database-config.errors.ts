/** The environment does not describe a usable database (see `.env.example`). */
export class InvalidDatabaseConfigError extends Error {
	override name = "InvalidDatabaseConfigError";
}
