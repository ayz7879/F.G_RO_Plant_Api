import express from "express";
import mongoose from "mongoose";
import adminRouter from "./Routes/Admin.js";
import customerRouter from "./Routes/Customer.js";
import jarRouter from "./Routes/Jar.js";
import cartRouter from "./Routes/Cart.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Define CORS options
const corsOptions = {
  origin: true,
  credentials: true, // Allows cookies to be sent and received
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
};

// Use CORS middleware with custom options
app.use(cors(corsOptions));

// Use express built-in middleware to parse JSON
app.use(express.json());

// Admin Route
app.use("/api/admin", adminRouter);

// Customer Route
app.use("/api/customer", customerRouter);

// Jar Router
app.use("/api/jar", jarRouter);

// Cart Router
app.use("/api/cart", cartRouter);

// Connect to the Database
mongoose
  .connect(process.env.CONNECTION_STRING, {
    dbName: process.env.DB_NAME,
  })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message);
  });

// Server Running
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
