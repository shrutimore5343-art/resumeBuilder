const dotenv = require("dotenv");
const path = require("path");
// Load Backend.env explicitly when running from the Backend folder
dotenv.config({ path: path.join(__dirname, "../Backend.env") });

module.exports = config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 8080,
  jwtSecret: process.env.JWT_SECRET || "shivam6862",
  mongoUrl: process.env.MONGODB_URL || process.env.MONGO_HOST,
};
