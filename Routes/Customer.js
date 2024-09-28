import express from "express";
const router = express.Router();
import {
  addCustomer,
  deleteCustomer,
  getAllCustomer,
  updateCustomer,
} from "../Controllers/Customer.js";

// Add a new customer
router.post("/addCustomer", addCustomer);

// Get All Customer
router.get("/getAllCustomer", getAllCustomer);

// Update Customer
router.put("/update/:id", updateCustomer);

// Delete Customer
router.delete("/delete/:id", deleteCustomer);

export default router;
