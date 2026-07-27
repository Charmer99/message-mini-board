const db = require("../db/queries")

const { Router } = require("express");
const router = Router();


router.get("/", async(req, res) => {
    try {
        const messages = await db.getAllMessages();

        res.render("index", {
            title: "Mini message Board",
            messages,
            error: null
        });
    } catch (error) {
        console.error("Home page error:", error.message);
        res.status(503).render("index", {
            title: "Mini message Board",
            messages: [],
            error: "The message board is temporarily unavailable. Please try again shortly."
        });
    }
})

router.get("/new", (req, res) => {
    res.render("form")
})

router.post("/new", async(req, res) => {
    const username = req.body.messageUser?.trim();
    const message = req.body.messageText?.trim();

    if (!username || !message) {
        return res.status(400).send("Please enter both your name and a message.");
    }

    try {
        const saved = await db.insertMessage(username, message);

        if (!saved) {
            return res.status(503).send("Unable to save your message right now. Please try again later.");
        }

        res.redirect("/");
    } catch (error) {
        console.error("Save message error:", error.message);
        return res.status(503).send("Unable to save your message right now. Please try again later.");
    }
})

router.get("/messages/:id", async(req, res) => {
    try {
        const message = await db.getMessageById(req.params.id);

        if (!message) {
            return res.status(404).render("message", {
                message: null,
                error: "Message not found or the database is unavailable."
            });
        }

        res.render("message", {
            message,
            error: null
        });
    } catch (error) {
        console.error("Message page error:", error.message);
        res.status(503).render("message", {
            message: null,
            error: "The message board is temporarily unavailable. Please try again shortly."
        });
    }
})

module.exports = router;