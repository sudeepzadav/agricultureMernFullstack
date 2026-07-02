const Users = require("../model/userSchema");
const errorHandler = require("../utils/errorHandler");
const bcrypt = require("bcrypt");

const {
  generateAccessToken,
  generateRefreshToken,
  generateVerificationToken,
  verifyToken,
} = require("../utils/generatesTokens");

const { sendVerificationEmail } = require("../utils/sendEmail");
// ===============================
// email verificaition
// ===============================
async function verifyEmail(req, res) {
  try {
    const { token } = req.params;

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification link",
      });
    }

    const user = await Users.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.verify) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    user.verify = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now login.",
    });
  } catch (error) {
    return errorHandler(res, error);
  }
}



// ===============================
// CREATE USER (signUp)
// ===============================
async function adduser(req, res) {
  try {
    let { name, email, password, role } = req.body;

    name = name?.trim();
    email = email?.trim().toLowerCase();
    password = password?.trim();
    role = role?.toLowerCase() || "customer";

    const allowedRoles = ["customer", "farmer"];
    if (!allowedRoles.includes(role)) role = "customer";

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

    const existingUser = await Users.findOne({ email });

    if (existingUser) {
      if (existingUser.verify) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      // resend verification for existing but unverified user
      const token = generateVerificationToken({
        email: existingUser.email,
        id: existingUser._id,
      });

      await sendVerificationEmail(existingUser.email, token); // ✅ fixed

      return res.status(200).json({
        success: true,
        message: "Verification email sent",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Users.create({
      name,
      email,
      password: hashedPassword,
      role,
      verify: false,
    });

    const token = generateVerificationToken({
      email: newUser.email,
      id: newUser._id,
    });

    await sendVerificationEmail(newUser.email, token);

    return res.status(201).json({
      success: true,
      message: "Please verify your email",
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
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    email = email.trim().toLowerCase();

    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.verify) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Password does not match",
      });
    }

    const accessToken = generateAccessToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      id: user._id,
    });

    return res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: accessToken,
        },
      });
  } catch (error) {
    return errorHandler(res, error);
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
    const userId = req.user?.id || req.user?._id;   // ← this line replaces `const { id } = req.params;`

    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const { name, email } = req.body;

    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User Not Found" });
    }

    return res.status(200).json({
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
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const deletedUser = await Users.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return errorHandler(res, error);
  }
}

// ===============================
// Change Password
// ===============================
async function changePassword(req, res) {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return errorHandler(res, error);
  }
}
module.exports = {
  verifyEmail,
  adduser,
  userSignIn,
  getUserById,
  updateUserById,
  deleteUserById,
  changePassword,
};
