const mongoose = require('mongoose')

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    products: [
      {
        productPrice: {
          type: Number,
        },
        productId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Cart', CartSchema)
