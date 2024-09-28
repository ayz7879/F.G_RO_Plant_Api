import express from "express";
import {
  addToCart,
  customerCart,
  deleteCartItem,
  getAllCarts,
  updateCartItem,
} from "../Controllers/Cart.js";

const router = express.Router();

//Add to cart
router.post("/add", addToCart);

//get Customer cart
router.get("/customer/:customerId", customerCart);

//get all cart
router.get("/customers", getAllCarts);

// update customer cart
router.put("/update/:customerId/:id", updateCartItem);

//delete cart item
router.delete("/remove/:customerId/:id", deleteCartItem);


export default router;
