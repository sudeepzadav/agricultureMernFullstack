const express = require("express");
const {
  verifyEmail,
  adduser,
  userSignIn,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("../controller/userController");

const route = express.Router();

route.post("/signUp", adduser);
route.get("/verify-email/:token", verifyEmail);
route.post("/login", userSignIn);
route.get("/:id", getUserById);
route.put("/:id", updateUserById);
route.delete("/:id", deleteUserById);

module.exports = route;