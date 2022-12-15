const SliderProduct = require('../models/SliderProduct')

//@desc Get all products
//@route GET /products
//@access public
const getAllSliderProducts = async (req, res) => {
  const queryNewest = req.query.sort
  const queryCategory = req.query.category

  let products

  if (queryNewest === 'newest' && queryCategory) {
    products = await SliderProduct.find({
      categories: { $in: [queryCategory] },
    }).sort({ createdAt: -1 })
    return res.json(products)
  } else if (queryNewest === 'lowest' && queryCategory) {
    products = await SliderProduct.find({
      categories: { $in: [queryCategory] },
    }).sort({ price: 1 })
    return res.json(products)
  } else if (queryNewest === 'highest' && queryCategory) {
    products = await SliderProduct.find({
      categories: { $in: [queryCategory] },
    }).sort({ price: -1 })
    return res.json(products)
  }

  if (queryNewest === 'newest') {
    products = await SliderProduct.find().sort({ createdAt: -1 })
    return res.json(products)
  }

  if (queryNewest === 'lowest') {
    products = await SliderProduct.find().sort({ price: 1 })
    return res.json(products)
  }

  if (queryNewest === 'highest') {
    products = await SliderProduct.find().sort({ price: -1 })
    return res.json(products)
  }

  if (queryCategory) {
    products = await SliderProduct.find({
      categories: { $in: [queryCategory] },
    })
    return res.json(products)
  }

  products = await SliderProduct.find().lean()

  if (!products?.length) {
    return res.status(400).json({ message: 'No product found' })
  }
  res.json(products)
}

//@desc Get a product
//@route GET /products
//@access public
const getSliderProduct = async (req, res) => {
  const id = req.params.id

  if (!id) {
    res.status(400).json({ message: 'ID required' })
  }

  if (id.length !== 24) {
    res.status(400).json({ message: 'ID is not valid' })
  }

  const product = await SliderProduct.findById(id).exec()

  if (!product) {
    res.status(400).json({ message: "SliderProduct doesn't exist" })
  }

  res.json(product)
}

//@desc Create new product
//@route POST /products
//@access private
const createNewSliderProduct = async (req, res) => {
  const { title, desc, img, categories, price } = req.body

  if (!title || !desc || !img || !categories || !price) {
    res.status(400).json({ message: 'All fields are required' })
  }

  const duplicate = await SliderProduct.findOne({ title }).lean().exec()

  if (duplicate) {
    res.status(409).json({ message: 'Duplicate titles' })
  }

  const productObject = {
    title,
    desc,
    img,
    categories,
    price,
  }

  if (!productObject) {
    res.status(400).json({ message: 'Invalid product data' })
  }
  const savedSliderProduct = await SliderProduct.create(productObject)

  res.status(200).json(`New product created: ${savedSliderProduct.title}`)
}

//@desc Update a product
//@route PATCH /products
//@access private
const updateSliderProduct = async (req, res) => {
  const { id, title, desc, img, categories, color, size, price } = req.body

  const product = await SliderProduct.findById(id).exec()

  if (!product) {
    res.status(400).json({ message: 'SliderProduct not found' })
  }

  const duplicate = await SliderProduct.findOne({ title }).lean().exec()

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

  const updatedSliderProduct = await product.save()

  res.json(`'${updatedSliderProduct.title}' updated`)
}

//@desc Delete product
//@route DELETE /products
//@access private
const deleteSliderProduct = async (req, res) => {
  const { id } = req.body

  if (!id) {
    res.status(400).json({ message: 'ID required' })
  }

  const product = await SliderProduct.findById(id).exec()

  if (!product) {
    res.status(400).json({ message: "SliderProduct doesn't exist" })
  }

  const deletedSliderProduct = await product.deleteOne()

  res.json(
    `SliderProduct ${deletedSliderProduct.title} with ID ${product._id} deleted`
  )
}

module.exports = {
  getAllSliderProducts,
  getSliderProduct,
  createNewSliderProduct,
  updateSliderProduct,
  deleteSliderProduct,
}
