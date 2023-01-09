const User = require("../models/User")
const bcrypt = require("bcrypt")

// desc Get all users
// route GET /users
// access Private

const getAllUsers = async (req, res) => {
  const users = await User.find().lean()
  if (!users) {
    return res.status(400).json({ message: "No user found" })
  }
  res.json(users)
}

// desc Create new user
// route POST /users
// access Private

const createNewUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" })
  }

  const duplicateEmail = await User.findOne({ email }).lean().exec()

  if (duplicateEmail) {
    return res
      .status(409)
      .json({ message: "this Email address is already assigned to an account" })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const userObject = {
    firstName,
    lastName,
    email,
    password: hashedPassword,
  }

  const user = await User.create(userObject)

  if (user) {
    res
      .status(201)
      .json({ message: `New user ${firstName} ${lastName} created` })
  } else {
    res.status(400).json({ message: "Invalid user data received" })
  }
}

// desc Update a user
// route PATCH /users
// access Private

const updateUser = async (req, res) => {
  const {
    id,
    firstName,
    lastName,
    email,
    address,
    number,
    password,
    city,
    newsLetter,
  } = req.body.user

  if (!id) {
    return res.status(400).json({ message: "ID required" })
  }

  const user = await User.findById(id).exec()

  if (!user) {
    return res.status(400).json({ message: "User not found" })
  }

  const duplicate = await User.findOne({ email }).lean().exec()

  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "email already exists" })
  }

  user.email = email
  user.firstName = firstName
  user.lastName = lastName
  user.address = address
  user.number = number
  user.city = city
  user.newsLetter = newsLetter

  if (password) {
    user.password = await bcrypt.hash(password, 10)
  }

  const updatedUser = await user.save()

  res.json({ message: `${updatedUser.email} updated` })
}

// desc delete a user
// route DELETE /users
// access Private

const deleteUser = async (req, res) => {
  const { id } = req.body

  if (!id) {
    return res.status(400).json({ message: "User ID required" })
  }

  const user = await User.findById(id).exec()

  if (!user) {
    return res.status(400).json({ message: "User not found" })
  }

  const result = await user.deleteOne()

  const reply = `Email ${result.email} with ID ${result._id} deleted`

  res.json(reply)
}

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
}
