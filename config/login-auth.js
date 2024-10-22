const passport = require("passport");
require("dotenv").config();
const User = require("../Models/user");
const GoogleStrategy = require("passport-google-oauth20").Strategy;


passport.use(
  "google-login",
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "https://www.treasure-cart.shop/login/google/callback",

    },
    async function (request, accessToken, refreshToken, profile, done) {
      try {
        console.log("Reached in Login Google Strategy");
        console.log("userrrrrrrrrrrr: ",profile)
        // for (const data in profile) {
        //   console.log(data + ": " + profile[data] + " (Login data)");
        // }

        // Check if the user is already registered (based on email)
        const existingUser = await User.findOne({
          email: profile.emails[0].value,
        });
        console.log("databaaase: ",existingUser);

        if (!existingUser) {
            // req.flash("errmsg","not registered")
          // If the user is not registered, you can handle this case as needed.
          // You can redirect them to a signup page or show an error message.
          return done(null, false, { message: "User not registered." });
        }

        // User is registered, so log them in
        // request.session.userAuth = true;
        done(null, profile);
      } catch (err) {
        console.error("Error during Google login:", err);
        done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
