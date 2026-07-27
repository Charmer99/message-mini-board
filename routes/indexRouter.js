const db = require("../db/queries")

const { Router } = require("express");
const router = Router();


router.get("/", async(req, res) => {
    const messages = await db.getAllMessages()

    res.render("index", {
        title: "Mini message Board",
        messages
    })
})

router.get("/new", (req, res) => {
    res.render("form")
})

router.post("/new", async(req, res) => {
  
    const { messageUser: username, messageText: message } = req.body
   await db.insertMessage(username,message)

    res.redirect("/")
    
})

router.get("/messages/:id", async(req, res) => {

    const message = await db.getMessageById(req.params.id)
    
    res.render("message", {
        message
    })
})

module.exports = router;