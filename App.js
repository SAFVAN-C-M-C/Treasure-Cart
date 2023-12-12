require("dotenv").config()
const express = require("express");
const app = express();
const userRouter = require("./routers/userRoutes")
require("./config/connection")
const path = require("path");
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const passport = require("passport");
const adminRouter = require("./routers/adminRoutes");
const flash = require("connect-flash")
const nocache = require("nocache");
require("./util/corn");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Views"));

//middlewares
app.use(nocache());
app.use("/static", express.static(path.join(__dirname, "Public")));
app.use(
  session({

    secret: uuidv4(),
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:7000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))




app.use('/', userRouter)
app.use("/admin", adminRouter);
app.get('*', (req, res) => {
  res.render("./Errors/404");
});



//port
const PORT = process.env.PORT || 8080

//serever
app.listen(PORT, () => {
  console.log(`The app is working on the port ${PORT}
    http://localhost:${PORT}`);
  console.log(`The admin is working on the port ${PORT}
    http://localhost:${PORT}/admin`);
})