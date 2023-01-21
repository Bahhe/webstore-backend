const User = require("../models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

//@desc Login
//@route POST auth/
//@access public
const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" })
  }

  const foundUser = await User.findOne({ email }).exec()
  if (!foundUser) {
    return res
      .status(401)
      .json({ message: "No account is linked to this email" })
  }
  const match = await bcrypt.compare(password, foundUser.password)
  if (!match) {
    return res.status(401).json({ message: "Wrong credentials" })
  }

  // JWT STARTS
  const accessToken = jwt.sign(
    {
      UserInfo: {
        id: foundUser._id,
        email: foundUser.email,
        isAdmin: foundUser.isAdmin,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  )
  const refreshToken = jwt.sign(
    {
      email: foundUser.email,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  )

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
  // JWT ENDS

  res.json({ accessToken })
}

//@desc Refresh
//@route GET auth/refresh
//@access public
const refresh = (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.json('Not logged in')

  const refreshToken = cookies.jwt

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" })

      const foundEmail = await User.findOne({
        email: decoded.email,
      }).exec()

      if (!foundEmail) {
        return res.status(401).json({ message: "Unauthorized" })
      }

      const accessToken = jwt.sign(
        {
          UserInfo: {
            id: foundEmail._id,
            email: foundEmail.email,
            isAdmin: foundEmail.isAdmin,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      )

      res.json({ accessToken })
    }
  )
}

//@desc Logout
//@route GET auth/logout
//@access public
const logout = (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204)
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true })
  res.json({ message: "Cookie cleared" })
}

module.exports = {
  login,
  refresh,
  logout,
}
