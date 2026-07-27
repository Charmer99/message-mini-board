require("dotenv").config();

const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
const poolConfig = {
    connectionString,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 10000,
};

if (connectionString && connectionString.includes("render.com")) {
    poolConfig.ssl = {
        rejectUnauthorized: false,
    };
}

module.exports = new Pool(poolConfig);
