const express = require("express");
const { Router } = require("express");

const router = Router();

const messages = [
    {
        text: "Hi there",
        user: "Amando",
        added: new Date(),
        
    },

    {
        text: "Hello world",
        user: "Charlers",
        added: new Date(),
    }
]

router.get("/", (req, res) => {
    res.render("index", {
        title: "Mini message Board",
        messages: messages
    })
})

router.get("/new", (req, res) => {
    res.render("form")
})

router.post("/new", (req, res) => {
  

    const messageUser = req.body.messageUser;
    const messageText = req.body.messageText

    messages.push({
        text: messageText,
        user: messageUser,
        added: new Date()
    })

    res.redirect("/")
    
})

router.get("/messages/:id", (req, res) => {
    const message = messages[req.params.id];
    
    res.render("message", {
        message: message
    })
})

module.exports = router;