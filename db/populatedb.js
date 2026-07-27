const { Client } = require("pg")

require("dotenv").config();

const SQL = `CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO messages (username, message)
VALUES
('Bryan', 'Welcome to the message board!'),
('Odin', 'Learning PostgreSQL is fun.'),
('Caleb', 'Hello everyone!');
`;

const connectionString = process.env.DATABASE_URL;
const client = new Client({
    connectionString,
    connectionTimeoutMillis: 10000,
    ssl: connectionString && connectionString.includes("render.com")
        ? { rejectUnauthorized: false }
        : undefined,
});

async function main() {
    console.log("seeding database....");

    try {
        await client.connect();
        await client.query(SQL);
        console.log("Done");
    } catch (error) {
        console.error("Failed to seed database:", error.message);
        process.exitCode = 1;
    } finally {
        await client.end().catch(() => {});
    }
}

main();
