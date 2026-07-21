const express = require("express");
const app = express();
const path = require("path");

const PORT = process.env.PORT || 3000;


const indexRouter = require("./routes/indexRouter");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});