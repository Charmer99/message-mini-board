const express = require("express");
const app = express();
const path = require("path")


const indexRouter = require("./routes/indexRouter");

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({extended: true}))

app.use("/", indexRouter)

 app.listen(3000, ()=> {
    console.log("Server running");
    
 })