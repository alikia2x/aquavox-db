import { Pool } from "https://deno.land/x/postgres@v0.19.3/mod.ts";

const requiredEnvVars = ["DB_HOST", "DB_NAME", "DB_USER", "DB_PASSWORD", "DB_PORT"];

const unsetVars = requiredEnvVars.filter((key) => Deno.env.get(key) === undefined);

if (unsetVars.length > 0) {
    throw new Error(`Missing required environment variables: ${unsetVars.join(", ")}`);
}

const databaseHost = Deno.env.get("DB_HOST")!;
const databaseName = Deno.env.get("DB_NAME")!;
const databaseUser = Deno.env.get("DB_USER")!;
const databasePassword = Deno.env.get("DB_PASSWORD")!;
const databasePort = Deno.env.get("DB_PORT")!;

const postgresConfig = {
    hostname: databaseHost,
    port: parseInt(databasePort),
    database: databaseName,
    user: databaseUser,
    password: databasePassword,
};

const pool = new Pool(postgresConfig, 4);

export const db = pool;
