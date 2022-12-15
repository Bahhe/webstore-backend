const Cart = require('../models/Cart')
const Product = require('../models/Product')
const User = require('../models/User')

//@desc get all carts
//@route GET /carts
//@access private
const getAllCarts = async (req, res) => {
  const cart = await Cart.find().lean()
  if (!cart?.length) {
    return res.status(200).json({ message: 'No carts found' })
  }

  res.json(cart)
}

//@desc get cart
//@route GET /carts
//@access private
const getCart = async (req, res) => {
  const userId = req.params.userId

  if (!userId) {
    return res.status(400).json({ message: 'ID required' })
  }
  if (userId.length !== 24) {
    return res.status(400).json({ message: 'ID not valid' })
  }

  const cart = await Cart.findOne({ userId: userId }).exec()

  if (!cart) {
    return res.status(200).json({ message: 'No carts found' })
  }

  res.json(cart)
}

//@desc create cart
//@route POST /carts
//@access private
const createNewCart = async (req, res) => {
  const newCart = new Cart(req.body)
  const productId = newCart.products[0].productId
  const exists = await Cart.findOne({
    products: { $elemMatch: { productId: `${productId}` } },
  }).exec()
  if (exists) {
    return res.json({ message: 'Product already exists' })
  }
  const savedCart = await newCart.save()
  res.json(savedCart)
}

//@desc update cart
//@route PATCH /carts
//@access private
const updateCart = async (req, res) => {
  const { id, userId, products } = req.body

  const cart = await Cart.findById(id).exec()

  if (!cart) {
    return res.status(400).json({ message: 'Cart not found' })
  }

  cart.userId = userId
  cart.products = products

  const updatedCart = await cart.save()

  res.json(`'${updatedCart._id}' updated`)
}

//@desc delete cart
//@route DELETE /carts
//@access private
const deleteCart = async (req, res) => {
  const { id } = req.body

  if (!id) {
    return res.status(400).json({ message: 'ID required' })
  }

  const cart = await Cart.findById(id).exec()

  if (!cart) {
    return res.status(400).json({ message: "Product doesn't exist" })
  }

  const deletedCart = await cart.deleteOne()

  res.json(`Cart ${deletedCart.id} deleted`)
}

module.exports = {
  getAllCarts,
  getCart,
  createNewCart,
  updateCart,
  deleteCart,
}
