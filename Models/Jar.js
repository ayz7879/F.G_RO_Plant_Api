import mongoose from "mongoose";

const jarSchema = new mongoose.Schema({
  jarsGiven: { type: Number, default: 0 },
  jarsTaken: { type: Number, default: 0 },
  customerPay: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  pendingJars: { type: Number, default: 0 },
  pendingPayment: { type: Number, default: 0 },
  totalJarsGiven: { type: Number, default: 0 },
  totalJarsTaken: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Jar = mongoose.model("Jar", jarSchema);

export default Jar;
