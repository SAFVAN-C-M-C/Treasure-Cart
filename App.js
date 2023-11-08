require("dotenv").config()
const express = require("express");
const app = express();
const userRouter = require("./routers/userRoutes")
const connection = require("./config/connection")
const path = require("path");
const fs = require("fs")
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const passport = require("passport");
const OTProutes = require("./util/otpindex")
const adminRouter = require("./routers/adminRoutes");
const flash = require("connect-flash")
const multer = require("multer");
const nocache = require("nocache");






app.set("view engine", "ejs");
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
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


//router
app.use('/', userRouter)
// app.use("/otp", OTProutes);
app.use("/admin", adminRouter);




//port
const PORT = process.env.PORT || 8080

//serever listen
app.listen(PORT, () => {
  console.log(`The app is working on the port ${PORT}
    http://localhost:${PORT}`);
})