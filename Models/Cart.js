import mongoose, { mongo } from "mongoose";



const cartItemSchema = new mongoose.Schema({
  jarsGiven: { type: Number, default: 0 },
  capsulesGiven: { type: Number, default: 0 },
  jarsTaken: { type: Number, default: 0 },
  capsulesTaken: { type: Number, default: 0 },
  customerPay: { type: Number, default: 0 },
  totalCustomerPaid: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  pendingJars: { type: Number, default: 0 },
  pendingCapsules: { type: Number, default: 0 },
  pendingPayment: { type: Number, default: 0 },
  totalJarsGiven: { type: Number, default: 0 },
  totalCapsulesGiven: { type: Number, default: 0 },
  totalJarsTaken: { type: Number, default: 0 },
  totalCapsulesTaken: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
});

const cartSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  item: [cartItemSchema],
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
