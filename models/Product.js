const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    desc: {
      type: String,
    },
    img: { type: String, required: true },
    categories: [
      {
        type: String,
      },
    ],
    price: {
      type: String,
    },
    section: {
      type: [String],
    },
    inStock: {
      type: Boolean,
    },
    cpu: {
      type: String,
    },
    ram: {
      type: String,
    },
    storage: {
      type: String,
    },
    display: {
      type: String,
    },
    vga: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Product", ProductSchema)
