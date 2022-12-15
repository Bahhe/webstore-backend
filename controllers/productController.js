const Product = require('../models/Product')

//@desc Get all products
//@route GET /products
//@access public
const getAllProducts = async (req, res) => {
  const queryNewest = req.query.sort
  const queryCategory = req.query.category

  let products

  if (queryNewest === 'newest' && queryCategory) {
    products = await Product.find({
      categories: { $in: [queryCategory] },
    }).sort({ createdAt: -1 })
    return res.json(products)
  } else if (queryNewest === 'lowest' && queryCategory) {
    products = await Product.find({
      categories: { $in: [queryCategory] },
    }).sort({ price: 1 })
    return res.json(products)
  } else if (queryNewest === 'highest' && queryCategory) {
    products = await Product.find({
      categories: { $in: [queryCategory] },
    }).sort({ price: -1 })
    return res.json(products)
  }

  if (queryNewest === 'newest') {
    products = await Product.find().sort({ createdAt: -1 })
    return res.json(products)
  }

  if (queryNewest === 'lowest') {
    products = await Product.find().sort({ price: 1 })
    return res.json(products)
  }

  if (queryNewest === 'highest') {
    products = await Product.find().sort({ price: -1 })
    return res.json(products)
  }

  if (queryCategory) {
    products = await Product.find({
      categories: { $in: [queryCategory] },
    })
    return res.json(products)
  }

  products = await Product.find().lean()

  if (!products?.length) {
    return res.status(400).json({ message: 'No product found' })
  }
  res.json(products)
}

//@desc Get a product
//@route GET /products
//@access public
const getProduct = async (req, res) => {
  const id = req.params.id

  if (!id) {
    res.status(400).json({ message: 'ID required' })
  }

  if (id.length !== 24) {
    res.status(400).json({ message: 'ID is not valid' })
  }

  const product = await Product.findById(id).exec()

  if (!product) {
    res.status(400).json({ message: "Product doesn't exist" })
  }

  res.json(product)
}

//@desc Create new product
//@route POST /products
//@access private
const createNewProduct = async (req, res) => {
  const { title, desc, img, categories, price, section } = req.body

  if (!title || !desc || !img || !categories || !price) {
    res.status(400).json({ message: 'All fields are required' })
  }

  const duplicate = await Product.findOne({ title }).lean().exec()

  if (duplicate) {
    res.status(409).json({ message: 'Duplicate titles' })
  }

  const productObject = {
    title,
    desc,
    img,
    categories,
    price,
    section,
  }

  if (!productObject) {
    res.status(400).json({ message: 'Invalid product data' })
  }
  const savedProduct = await Product.create(productObject)

  res.status(200).json(`New product created: ${savedProduct.title}`)
}

//@desc Update a product
//@route PATCH /products
//@access private
const updateProduct = async (req, res) => {
  const { id, title, desc, img, categories, color, size, price } = req.body

  const product = await Product.findById(id).exec()

  if (!product) {
    res.status(400).json({ message: 'Product not found' })
  }

  const duplicate = await Product.findOne({ title }).lean().exec()

  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate product title' })
  }

  product.title = title
  product.desc = desc
  product.img = img
  product.categories = categories
  product.color = color
  product.size = size
  product.price = price

  const updatedProduct = await product.save()

  res.json(`'${updatedProduct.title}' updated`)
}

//@desc Delete product
//@route DELETE /products
//@access private
const deleteProduct = async (req, res) => {
  const { id } = req.body

  if (!id) {
    res.status(400).json({ message: 'ID required' })
  }

  const product = await Product.findById(id).exec()

  if (!product) {
    res.status(400).json({ message: "Product doesn't exist" })
  }

  const deletedProduct = await product.deleteOne()

  res.json(`Product ${deletedProduct.title} with ID ${product._id} deleted`)
}

module.exports = {
  getAllProducts,
  getProduct,
  createNewProduct,
  updateProduct,
  deleteProduct,
}
