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
  origin: "*",
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
  .connect("mongodb+srv://yashish393:Ayz7879%40%40@fg.ar2ie.mongodb.net/", {
    dbName: "FGROPlant",
  })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message);
  });

// Server Running
const port = 1000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
