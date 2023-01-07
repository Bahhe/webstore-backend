const User = require("../models/User")
const bcrypt = require("bcrypt")

// desc Get all users
// route GET /users
// access Private

const getAllUsers = async (req, res) => {
  const query = req.query.new
  const users = query
    ? await User.find().sort({ _id: -1 }).limit(5)
    : await User.find().select("-password").lean()
  if (!users) {
    return res.status(400).json({ message: "No user found" })
  }

  res.json(users)
}

// desc Get users statistics
// route GET /stats/users
// access Private

const getUsersStats = async (req, res) => {
  const date = new Date()
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))

  const stats = await User.aggregate([
    {
      $match: { createdAt: { $gt: lastYear } },
    },
    {
      $project: {
        month: {
          $month: "$createdAt",
        },
      },
    },
    {
      $group: {
        _id: "$month",
        total: {
          $sum: 1,
        },
      },
    },
  ])

  if (!stats) {
    res.status(400).json({ message: "Somthing went wrong" })
  }

  res.json(stats)
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
  const { id, firstName, lastName, email } = req.body.user

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
  getUsersStats,
  createNewUser,
  updateUser,
  deleteUser,
}
