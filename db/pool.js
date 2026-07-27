require("dotenv").config();

const { Pool, Client } = require('pg');
const { URL } = require('url');

const connectionString = process.env.DATABASE_URL;
const sslConfig = connectionString && connectionString.includes("render.com")
    ? { rejectUnauthorized: false }
    : undefined;

const poolConfig = {
    connectionString,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 10000,
};

if (sslConfig) {
    poolConfig.ssl = sslConfig;
}

const pool = new Pool(poolConfig);

async function ensureDatabaseAndSchema() {
    if (!connectionString) {
        throw new Error("DATABASE_URL is not configured");
    }

    const parsedUrl = new URL(connectionString);
    const targetDatabase = parsedUrl.pathname.replace(/^\/+/, "") || "postgres";
    const adminUrl = new URL(connectionString);
    adminUrl.pathname = "/postgres";

    const adminClient = new Client({
        connectionString: adminUrl.toString(),
        ssl: sslConfig,
    });

    try {
        await adminClient.connect();
        const { rows } = await adminClient.query(
            "SELECT 1 FROM pg_database WHERE datname = $1",
            [targetDatabase]
        );

        if (rows.length === 0) {
            console.log(`Creating database ${targetDatabase}...`);
            await adminClient.query(`CREATE DATABASE "${targetDatabase}"`);
        }

        await adminClient.end();

        const schemaClient = new Client({
            connectionString,
            ssl: sslConfig,
        });

        try {
            await schemaClient.connect();
            await schemaClient.query(`
                CREATE TABLE IF NOT EXISTS messages (
                    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                    username VARCHAR(255) NOT NULL,
                    message TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
        } finally {
            await schemaClient.end().catch(() => {});
        }
    } catch (error) {
        await adminClient.end().catch(() => {});
        throw error;
    }
}

pool.ensureDatabaseAndSchema = ensureDatabaseAndSchema;

module.exports = pool;
