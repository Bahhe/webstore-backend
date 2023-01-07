const { logEvents } = require("./logger")

const errorHanlder = (err, req, res, next) => {
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "errLog.log"
  )
  console.log(err.stack)

  const stauts = res.statusCode ? res.statusCode : 500

  res.status(stauts).json({ message: err.message, isError: true })

  next()
}

module.exports = errorHanlder
