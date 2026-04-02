import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:
      process.env.GOOGLE_CALLBACK_URL ||
     "http://localhost:5001/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      let user = await User.findOne({ email });

      if (!user) {
        // If user doesn't exist, create new
        const isAdmin = email === process.env.ADMIN_EMAIL;
        user = await User.create({
          name: profile.displayName,
          email,
          googleId: profile.id,
          image: profile.photos[0].value,
          role: isAdmin ? "admin" : "user",
          verified: true,
        });
      } else if (!user.googleId) {
        user.googleId = profile.id;
        if (!user.image && profile.photos?.[0]?.value) {
          user.image = profile.photos[0].value;
        }
        await user.save();
      }

      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
