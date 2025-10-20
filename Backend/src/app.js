const express = require("express");
const routes = require("./routes");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const fileUpload = require("express-fileupload");

// Load .env
dotenv.config({ path: path.join(__dirname, "../Backend.env") });

const app = express();

// ✅ Ensure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve uploads folder safely
app.use("/uploads", express.static(uploadDir));

// Middleware
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, AuthToken"
  );
  next();
});

// Register routes
routes.forEach((route) => app[route.method](route.path, route.handler));

// MongoDB connection
mongoose.set("strictQuery", false);
if (!process.env.MONGODB_URL) {
  console.error(
    "Missing MONGODB_URL environment variable. Please set it in Backend/Backend.env or a .env file."
  );
  process.exit(1);
}

console.log("Using MONGODB_URL:", process.env.MONGODB_URL);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(8080, () => {
      console.log("Server running on http://localhost:8080");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// ✅ Example upload route
app.post("/upload", (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).send("No file uploaded");
  }

  const file = req.files.file;
  const savePath = path.join(uploadDir, file.name);

  file.mv(savePath, (err) => {
    if (err) return res.status(500).send(err);
    res.send({ message: "File uploaded successfully!", filename: file.name });
  });
});
