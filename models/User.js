const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    address: {
      type: String,
    },
    number: {
      type: String,
    },
    city: {
      type: String,
    },
    password: {
      type: String,
    },
    newsLetter: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("User", UserSchema)
