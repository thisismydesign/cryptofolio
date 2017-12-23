const exchanges = require('./exchanges')
const express = require('express')
const router = express.Router()

router.get('/', function (req, res) {
  res.status(200).json(exchanges.list())
})

module.exports = {
	router: router
}
