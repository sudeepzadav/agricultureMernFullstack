const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["customer", "farmer"],
      required: true,
      default: "customer",
    },
  },
  {
    timestamps: true,
  },
);

const Users = mongoose.model("user", userSchema);

module.exports = Users;
