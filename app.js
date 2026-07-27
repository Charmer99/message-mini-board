const express = require("express");
const app = express();
const path = require("path");
const pool = require("./db/pool");

const PORT = process.env.PORT || 3000;

const indexRouter = require("./routes/indexRouter");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

(async () => {
   try {
      await pool.ensureDatabaseAndSchema();
   } catch (error) {
      console.error("Database bootstrap failed:", error.message);
   }

   app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
   });
})();