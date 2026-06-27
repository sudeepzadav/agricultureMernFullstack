const Users = require("../model/userSchema");
const errorHandler = require("../utils/errorHandler");
const bcrypt = require("bcrypt");
const { generateJwt } = require("../utils/generatesTokens");
const { sendVerificationEmail } = require("../utils/sendEmail"); 
// ===============================
// CREATE USER (signUp)
// ===============================
async function adduser(req, res) {
  try {
    let { name, email, password, role } = req.body;

    // normalize inputs
    name = name?.trim();
    email = email?.trim().toLowerCase();
    password = password?.trim();
    role = role?.toLowerCase() || "customer";

    // allowed roles
    const allowedRoles = ["customer", "farmer"];
    if (!allowedRoles.includes(role)) {
      role = "customer";
    }

    // validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // check existing user
    const existingUser = await Users.findOne({ email });

    if (existingUser) {
      if (existingUser.verify) {
        return res.status(400).json({
          success: false,
          message: "User already registered with this email",
        });
      }

      // resend verification email
      const token = generateJwt({
        email: existingUser.email,
        id: existingUser._id,
      });

      await sendVerificationEmail(existingUser.email, token);

      return res.status(201).json({
        success: true,
        message: "Please check your email for verification link",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const newUser = await Users.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // generate JWT
    const token = generateJwt({
      email: newUser.email,
      id: newUser._id,
    });

    // send verification email
    await sendVerificationEmail(newUser.email, token);

    return res.status(201).json({
      success: true,
      message: "Please check your email for verification link",
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
      role: user.role,
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
// GET USER BY ID(user profile)
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
