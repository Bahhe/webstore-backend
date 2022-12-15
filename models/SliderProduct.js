const mongoose = require('mongoose')

const SliderProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    img: { type: String, required: true },
    categories: [
      {
        type: String,
      },
    ],
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('SliderProduct', SliderProductSchema)
