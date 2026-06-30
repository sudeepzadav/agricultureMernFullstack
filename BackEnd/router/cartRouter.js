const express = require("express");
const verifyUser = require("../middleware/auth");
const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controller/cartController");

const router = express.Router();

router.post("/addtoCart", verifyUser, addToCart);
router.get("/", verifyUser, getCart);
router.put("/update", verifyUser, updateCartItem);
router.delete("/remove/:productId", verifyUser, removeCartItem);
router.delete("/clear", verifyUser, clearCart);

module.exports = router;