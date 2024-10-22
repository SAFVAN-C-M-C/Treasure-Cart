const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const Users = require("../Models/user");
passport.use(
  "google-signup",
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "https://www.treasure-cart.shop/auth/google/callback",
      scope: ["profile", "email"],
    },
    async function (request, accessToken, refreshToken, profile, done) {
      try {
        // console.log(profile);
        // console.log(profile.emails[0].value);
        // console.log(profile.photos[0].value);
        const email=profile.emails[0].value
        const existingUser = await Users.findOne({
          email: email,
        });
        console.log("existimg user: ",existingUser);
        if (existingUser) {
          // Authentication failed due to duplicate email
          return done(null, false, { errmsg: "Duplicate email found." });
        }
        // let userInformation = {
        //   userName: profile.displayName,
        //   email: profile.emails[0].value,
        //   profile: profile.photos[0].value,
        //   joined: Date.now(),
        // };
        // console.log(userInformation);
        // Save the new user data to the database
        // const user=await  Users.insertMany([userInformation])
        
        // console.log(profile.emails[0].value);
        // request.session.email = profile.emails[0].value;
        // console.log(request.session.email);
        console.log("done");
        done(null, profile);
        
      } catch (err) { 
        console.log("error found whle passpor" + err);
      }
    }
  )
);
passport.serializeUser((user,done)=>{
    done(null,user);
});
passport.deserializeUser((user,done)=>{
    done(null,user);
});