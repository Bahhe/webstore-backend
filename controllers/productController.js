const Product = require("../models/Product")
const redis = require("redis")

let redisClient
;(async () => {
  redisClient = redis.createClient()

  redisClient.on("error", (error) => console.error(`Error : ${error}`))

  await redisClient.connect()
})()

//@desc List products
//@route GET /products
//@access public
const listProducts = async (req, res) => {
  const page = parseInt(req.query.page) - 1 || 0
  const limit = parseInt(req.query.limit) || 6
  const search = req.query.search || ""
  let sort = req.query.sort || "newest"
  let category = req.query.category || "all"

  const categories = [
    "allInOne",
    "chromebook",
    "gaming",
    "apple",
    "tablet",
    "touchScreen",
    "acer",
    "dell",
    "hp",
    "lenovo",
    "asus",
    "other",
  ]

  category === "all"
    ? (category = [...categories])
    : (category = req.query.category.split(","))

  if (sort === "newest") {
    sort = { createdAt: -1 }
  }
  if (sort === "lowest") {
    sort = { price: 1 }
  }
  if (sort === "highest") {
    sort = { price: -1 }
  }

  let products
  products = await Product.find({
    title: { $regex: search, $options: "i" },
  })
    .where("categories")
    .in([...category])
    .sort(sort)
    .collation({ locale: "en_US", numericOrdering: true })
    .skip(page * limit)
    .limit(limit)

  let total
  total = await Product.countDocuments({
    categories: { $in: [...category] },
    title: { $regex: search, $options: "i" },
  })

  const response = {
    error: false,
    total,
    page: page + 1,
    limit,
    category: categories,
    products,
  }
  res.json(response)
}

//@desc Get all products
//@route GET /products
//@access public
const getAllProducts = async (req, res) => {
  let products
  const cachedProducts = await redisClient.get("products")
  if (cachedProducts) {
    products = JSON.parse(cachedProducts)
    res.json(products)
  } else {
    products = await Product.find().lean()
    if (!products) {
      return res.status(400).json({ message: "something went worng" })
    }
    await redisClient.set("products", JSON.stringify(products))
    res.json(products)
  }
}

//@desc Get a product
//@route GET /products
//@access public
const getProduct = async (req, res) => {
  const id = req.params.id
  if (!id) {
    res.status(400).json({ message: "ID required" })
  }
  if (id.length !== 24) {
    res.status(400).json({ message: "ID is not valid" })
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
  const {
    title,
    desc,
    img,
    categories,
    price,
    section,
    inStock,
    cpu,
    ram,
    storage,
    display,
    vga,
  } = req.body

  if (!title || !desc || !img || !categories || !price) {
    return res.status(400).json({
      message:
        "Thease fileds are required: title, desc, img, categories, price",
    })
  }

  const productObject = {
    title,
    desc,
    img,
    categories,
    price,
    section,
    inStock,
    cpu,
    ram,
    storage,
    display,
    vga,
  }

  if (!productObject) {
    res.status(400).json({ message: "Invalid product data" })
  }
  const savedProduct = await Product.create(productObject)
  res.status(200).json(`New product created: ${savedProduct.title}`)
}

//@desc Update a product
//@route PATCH /products
//@access private
const updateProduct = async (req, res) => {
  const {
    id,
    title,
    desc,
    img,
    categories,
    section,
    inStock,
    price,
    cpu,
    ram,
    storage,
    display,
    vga,
  } = req.body.product

  const product = await Product.findById(id).exec()

  if (!product) {
    res.status(400).json({ message: "Product not found" })
  }

  product.title = title
  product.desc = desc
  product.img = img
  product.categories = categories
  product.price = price
  product.section = section
  product.inStock = inStock
  product.cpu = cpu
  product.ram = ram
  product.display = display
  product.vga = vga
  product.storage = storage

  const updatedProduct = await product.save()

  res.json(`'${updatedProduct.title}' updated`)
}

//@desc Delete product
//@route DELETE /products
//@access private
const deleteProduct = async (req, res) => {
  const { id } = req.body
  if (!id) {
    res.status(400).json({ message: "ID required" })
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
  listProducts,
  getProduct,
  createNewProduct,
  updateProduct,
  deleteProduct,
}
