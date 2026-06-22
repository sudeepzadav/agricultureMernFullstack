const Users = require("../model/userSchema");
const errorHandler = require("../utils/errorHandler");
const bcrypt = require("bcrypt");
const { generateJwt } = require("../utils/generatesTokens");

// ===============================
// CREATE USER (signUp)
// ===============================
async function adduser(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password || password.trim().length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password should be at least 8 characters",
      });
    }

    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await Users.create({
      name,
      email,
      password: hashPassword,
      role: req.body.role,
    });

    return res.status(201).json({
      success: true,
      message: "User created dsuccessfully",
      user: newUser,
    });
  } catch (error) {
    return errorHandler(res, error);
  }
}

// ===============================
// signIn
// ===============================
async function userSignIn(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = await generateJwt({
      email: user.email,
      id: user._id,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    errorHandler(res, error);
  }
}

// ===============================
// GET USER BY ID(user orofile)
// ===============================
async function getUserById(req, res) {
  try {
    const { id } = req.params;

    const user = await Users.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }

    return res.json({
      success: true,
      message: "user fetched successfully",
      user,
    });
  } catch (error) {
    return errorHandler(res, error);
  }
}

// ===============================
// Update USER BY ID
// ===============================

async function updateUserById(req, res) {
  try {
    const { id } = req.params;

    const updatedUser = Users.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }

    return res.status(201).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return errorHandler(res, error);
  }
}

// ===============================
// Delete USER BY ID
// ===============================
async function deleteUserById(req, res) {
  try {
    const { id } = req.params;

    const deletedUser = Users.findByIdAndDelete(id);
    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }

    return res
      .status(201)
      .json({ success: true, message: "User deleted successfull" });
  } catch (error) {
    return errorHandler(res, error);
  }
}
module.exports = {
  adduser,
  userSignIn,
  getUserById,
  updateUserById,
  deleteUserById,
};
