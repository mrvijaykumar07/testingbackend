// File: index.js
import express from "express";
import helmet from "helmet";
import passport from "passport";
import config from "./config/env.js";
import cors from "cors";
import cookieParser from "cookie-parser";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import studioRoutes from "./routes/studioRoutes.js";

import { connectDB } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || config.port;


app.use(helmet());
app.use(cookieParser());


const allowedOrigins = [
  config.FRONTEND_ORIGIN,
  "https://testingfrontend-tau.vercel.app",
  "http://127.0.0.1:5173",
  "http://localhost:5173",
];


app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("CORS blocked:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "client_secret"],
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));





app.get("/ping", (req, res) => {
  res.status(200).json({ message: "Backend is awake!" });
});

app.use(passport.initialize());

//  Routes------------------------------------------------
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/studio", studioRoutes);



app.get("/", (req, res) => {
  res.send("Qpix Backend is running successfully!");
});


connectDB()
  .then(() => {
    app.listen(PORT,"0.0.0.0", () => {
      console.log("========================================");
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`Allowed Origins: ${allowedOrigins.join(", ")}`);
      console.log("========================================");
    });
  })
  .catch((err) => {
    console.error(" Failed to connect to MongoDB:", err);
  });

export default app;
