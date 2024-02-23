if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const mongoSanitize = require("express-mongo-sanitize");
const flash = require("connect-flash");
// helmet

// -- MODELS --
const Rsvp = require("./models/rsvpSchema");
const Wish = require("./models/wishSchema");

const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("Database Connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize());

app.use(
  session({
    secret: "weddinginvitation",
    saveUninitialized: true,
    resave: true,
  })
);
// app.use((req, res, next) => {
//   res.locals.success = req.flash("success");
//   res.locals.error = req.flash("error");
//   next();
// });
app.post("/rsvp", async (req, res, next) => {
  try {
    const rsvp = new Rsvp(req.body);
    await rsvp.save();
    res.redirect("/");
  } catch (error) {
    console.error("Error in /rsvp:", error);
    res.redirect("/");
  }
});

app.post("/wishes", async (req, res, next) => {
  try {
    const wish = new Wish(req.body);
    await wish.save();
    res.redirect("/");
  } catch (error) {
    console.error("Error in /wishes:", error);
    res.redirect("/");
  }
});

app.get("/", async (req, res, next) => {
  const { q = "Tamu Undangan" } = req.query;

  try {
    const wishes = await Wish.find({}).sort({ created_at: -1 });
    res.render("homefix", { wishes, q });
  } catch (error) {
    console.error("Error in /:", error);
    res.status(500).render("error", { error });
  }
});

// Handle 404 errors
// app.use((req, res, next) => {
//   const err = new Error("Page Not Found");
//   err.status = 404;
//   next(err);
// });

// Generic error handler
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;

  if (!err.message) {
    err.message = "Oh no, Something Went Wrong!";
  }

  console.error("Error:", err);
  res.status(status).render("error");
});

app.listen(3000, (req, res) => {
  console.log("listening to 3000");
});
