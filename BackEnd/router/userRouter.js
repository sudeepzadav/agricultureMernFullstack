const express = require("express");
const {
  verifyEmail,
  adduser,
  userSignIn,
  getUserById,
  updateUserById,
  changePassword,
  deleteUserById,
} = require("../controller/userController");
const auth = require("../middleware/auth"); // <-- your auth middleware, adjust path

const route = express.Router();

// public
route.post("/signUp", adduser);
route.get("/verify-email/:token", verifyEmail);
route.post("/login", userSignIn);

// protected — operate on the logged-in user, no :id needed
route.get("/profile", auth, getUserById);
route.put("/profile", auth, updateUserById);
route.put("/change-password", auth, changePassword);
route.delete("/", auth, deleteUserById);

module.exports = route;