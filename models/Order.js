const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema(
  {
    products: {
      type: [String],
    },
    email: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    city: {
      type: String,
    },
    number: {
      type: String,
    },
    shipping: {
      type: String,
    },
    status: {
      type: String,
      default: "waiting",
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Order", OrderSchema)
