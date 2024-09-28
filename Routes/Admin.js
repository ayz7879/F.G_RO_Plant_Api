import express from "express";
import {
  adminLogin,
  adminRegister,
  getAllAdmins,
} from "../Controllers/Admin.js";

const router = express.Router();

//Admin Register
router.post("/register", adminRegister);

// Admin login
router.post("/login", adminLogin);

// Route to get all admins
router.get("/getAllAdmin", getAllAdmins);

export default router;
