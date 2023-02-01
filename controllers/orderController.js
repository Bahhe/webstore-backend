const Order = require("./../models/Order")

//@Desc new order
//@Route POST /order
//@Access Public
const createNewOrder = async (req, res) => {
  const { products, email, firstName, lastName, city, number, shipping } =
    req.body

  if (!products || !email || !firstName || !lastName || !city || !number) {
    return res.status(400).json({ message: "All fields are required" })
  }

  const orderObject = {
    products,
    email,
    firstName,
    lastName,
    city,
    number,
    shipping,
  }
  if (!orderObject) {
    res.status(400).json({ messge: "invalid order data" })
  }

  const savedOrder = await Order.create(orderObject)
  res.json({ messsage: `New order ${savedOrder} created` })
}

//@Desc get all orders
//@Route GET /orders
//@Access private
const getAllOrders = async (req, res) => {
  const Orders = await Order.find().lean()
  if (!Orders?.length) {
    return res.status(404).json({ message: "No orders found" })
  }
  res.json(Orders)
}

//@Desc delete order
//@Route DELETE /orders
//@Access private
const deleteOrder = async (req, res) => {
  const { id } = req.body
  if (!id) {
    res.status(400).json({ message: "ID required" })
  }
  const order = await Order.findById(id).exec()

  if (!order) {
    res.status(400).json({ message: "Order doesn't exist" })
  }
  const deletedOrder = await order.deleteOne()
  res.json(`Order with id ${deletedOrder.id} deleted`)
}

//@Desc Update order
//@Route PATCH /orders
//@Access private
const updateOrder = async (req, res) => {
  const { id, status } = req.body.order
  const order = await Order.findById(id).exec()
  if (!order) {
    res.status(400).json({ message: "Order not found" })
  }
  order.status = status
  const updatedOrder = await order.save()
  res.json(`'${updatedOrder.id}' updated`)
}

module.exports = {
  getAllOrders,
  createNewOrder,
  deleteOrder,
  updateOrder,
}
