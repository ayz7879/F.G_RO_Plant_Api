import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hash the password in production
});

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
