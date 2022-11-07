const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const config = require("./config/database");
const pages = require("./routes/pages");
const adminPages = require("./routes/admin_pages.js");
const bodyParser = require("body-parser");
const session = require("express-session");
const expressValidator = require("express-validator");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "mustbeauniquesessiontonotgethacking",
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true },
  })
);

app.use(require("connect-flash")());
app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

app.use(express.static(path.join(__dirname, "public")));
app.locals.errors = null;

app.use("/admin/pages", adminPages);
app.use("/", pages);

mongoose
  .connect(config.database)
  .then(() => {
    console.log("Database connected");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
  
