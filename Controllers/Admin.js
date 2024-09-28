import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
import { generateToken } from "../utils/jwt.js";

//Admin Register
export const adminRegister = async (req, res) => {
  const { name, username, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.json({ message: "Admin already exists", success: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      username,
      password: hashedPassword,
    });
    const token = generateToken(admin);
    res.json({ message: "Register Succesfully", success: true, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Admin Login
export const adminLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res
        .status(401)
        .json({ message: "Admin Not Found", success: false });
    }

    const validPass = await bcrypt.compare(password, admin.password);
    if (!validPass) {
      return res
        .status(401)
        .json({ message: "Wrong Password", success: false });
    }
    const token = generateToken(admin);
    res.json({
      message: `Login Successfully,${admin.name}`,
      success: true,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Admins
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();

    if (!admins)
      return res.json({ message: "No Admin Available", success: false });

    res.json({
      message: "Successfully Get All Admins",
      success: true,
      admins,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
