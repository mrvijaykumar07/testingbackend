import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET,
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN,
  Google_Client_ID: process.env.GOOGLE_CLIENT_ID,
  Google_Client_Secret: process.env.GOOGLE_CLIENT_SECRET,
  callBackUrl: process.env.CALLBACK_URL,
  MONGODB_URI: process.env.MONGODB_URI,
  NODE_ENV: process.env.NODE_ENV || "development",
};

const requiredKeys = [
  "JWT_SECRET",
  "MONGODB_URI",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "CALLBACK_URL",
  "FRONTEND_ORIGIN",
];

requiredKeys.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`Missing required environment variable: ${key}`);
  }
});

console.log("env loaded successfully.");

export default config;