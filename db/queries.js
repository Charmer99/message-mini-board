const pool = require("./pool");

async function getAllMessages() {
    try {
        const { rows } = await pool.query(
            "SELECT id, username, message, created_at FROM messages ORDER BY created_at DESC"
        );

        return rows;
    } catch (error) {
        console.error("Unable to fetch messages:", error.message);
        return [];
    }
}

async function getMessageById(id) {
    try {
        const { rows } = await pool.query(
            "SELECT id, username, message, created_at FROM messages WHERE id = $1",
            [id]
        );

        return rows[0] || null;
    } catch (error) {
        console.error("Unable to fetch message:", error.message);
        return null;
    }
}

async function insertMessage(username, message) {
    try {
        await pool.query(
            "INSERT INTO messages (username, message) VALUES ($1, $2)",
            [username, message]
        );

        return true;
    } catch (error) {
        console.error("Unable to insert message:", error.message);
        return false;
    }
}

module.exports = {
    getAllMessages,
    getMessageById,
    insertMessage,
};