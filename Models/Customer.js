import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  advancePaid: { type: Number, default: 0 },
  jarDeposit: { type: Number, default: 0 },
  pricePerJar: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
