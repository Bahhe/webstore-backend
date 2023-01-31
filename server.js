require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()
const path = require('path')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const { logger, logEvents } = require('./middleware/logger')
const errorHanlder = require('./middleware/errorHandler')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 5000

console.log(process.env.NODE_ENV)

connectDB()

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

if (process.env.NODE_ENV === 'production') {
  app.use(
    '/',
    express.static(path.join(__dirname, '/webstore-frontend', 'build'))
  )

  app.get('*', (req, res) => {
    res.sendFile(
      path.resolve(__dirname, '/webstore-frontend', 'build', 'index.html')
    )
  })
} else {
  app.use('/', express.static(path.join(__dirname, '/public')))
}

app.use('/', require('./routes/root'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/users', require('./routes/userRoutes'))
app.use('/products', require('./routes/productRoutes'))
app.use('/orders', require('./routes/orderRoutes'))

app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
    res.json({ message: '404 Not Found' })
  } else {
    res.type('txt').send('404 Not Found')
  }
})

app.use(errorHanlder)

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
  app.listen(PORT, () => console.log(`Server running on ${PORT}`))
})

mongoose.connection.on('error', (err) => {
  console.log(err)
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    'mongoErrorLog.log'
  )
})
