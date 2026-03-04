// This contains all routes for authentication
import express from "express";
import passport from "passport";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { authenticate } from "../middlewares/authMiddlewares.js";
import config from "../config/env.js";
import { User } from "../models/userModel.js";

const router = express.Router();

// --- Rate Limiter Example ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, try again later",
});
router.use(limiter);

// --- Google OAuth Strategy ---
passport.use(
  new GoogleStrategy(
    {
      clientID: config.Google_Client_ID,
      clientSecret: config.Google_Client_Secret,
      callbackURL: config.callBackUrl,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();

        let user = await User.findOne({ email });

        if (user) {
          console.info(
            `[Auth] Existing user login via Google - userId: ${user._id}`,
          );
        } else {
          console.info(
            `[Auth] New user created via Google OAuth - email: ${email}`,
          );
          user = await User.create({
            email,
            name: profile.displayName || "Google User",
            google_id: profile.id,
            profile_picture_url: profile._json?.picture || "",
            isVerified: true,
          });
        }

        return done(null, user);
      } catch (err) {
        console.error(`[Auth] Google OAuth strategy failed: ${err.message}`);
        return done(err, null);
      }
    },
  ),
);

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// --- Google Auth Routes ---
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  async (req, res) => {
    try {
      let user = req.user;

      //  If somehow req.user missing, fetch or create manually
      if (!user) {
        console.log("⚠️ req.user missing, fetching/creating manually...");
        const email = req.query.email || req.body.email;
        const profile = req.user || {};
        user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName || "Google User",
            google_id: profile.id,
            profile_picture_url: profile._json?.picture || "",
          });
          console.log(" User created manually:", user.email);
        }
      }

      if (!user) {
        console.log(" Could not find or create user");
        return res
          .status(401)
          .json({ success: false, message: "User creation failed" });
      }

      //  Generate JWT with real DB id

      const token = jwt.sign({ id: user._id }, config.jwtSecret, {
        expiresIn: "30d",
      });


      //----------------for development -------------------------
      // const isProduction = process.env.NODE_ENV === "production";
      // res.cookie("jwtToken", token, {
      //   httpOnly: true,
      //   maxAge: 30 * 24 * 60 * 60 * 1000,
      //   sameSite: isProduction ? "None" : "Lax",
      //   secure: isProduction,
      // });

      res.cookie("jwtToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      console.info(`[Auth] Login successful - userId: ${user._id}`);
      res.redirect(config.FRONTEND_ORIGIN);
    } catch (err) {
      console.error(" Google callback error:", err);
      res.redirect(config.FRONTEND_ORIGIN + "/login?error=true");
    }
  },
);

// -- Get User Profile (NEW) ---
router.get("/profile", authenticate, async (req, res) => {
  try {
    return res.json({
      success: true,
      message: "User fetched successfully",
      data: {
        user: {
          name: req.user.name,
          email: req.user.email,
          profile_picture_url: req.user.profile_picture_url,
          favorites: req.user.favorites || [],
        },
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// --- Get User Photo (Optimized) ---
router.get("/photo", authenticate, async (req, res) => {
  try {
    if (!req.user.profile_picture_url) {
      return res.status(204).send();
    }
    const result = await fetch(req.user.profile_picture_url);
    const buffer = Buffer.from(await result.arrayBuffer());
    res.set("Content-Type", "image/jpeg").send(buffer);
  } catch (error) {
    res.status(500).json({ message: "Error loading profile image" });
  }
});
// ------------------For development-------------------------
// router.get("/logout", (req, res) => {
//   const isProduction = process.env.NODE_ENV === "production";

//   res.clearCookie("jwtToken", {
//     httpOnly: true,
//     secure: isProduction,
//     sameSite: isProduction ? "None" : "Lax",
//     path: "/",
//   });

//   return res.status(200).json({
//     success: true,
//     message: "Logged out successfully",
//   });
// });


router.post("/logout", (req, res) => {
  res.clearCookie("jwtToken", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

export default router;
