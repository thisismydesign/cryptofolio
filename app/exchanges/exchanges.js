const crypto_exchange = require('crypto-exchange')
const express = require('express')
const router = express.Router()

router.get('/', function (req, res) {
  res.status(200).json(list())
})

function list() {
	return Object.keys(crypto_exchange)
}

module.exports = {
	router: router,
	list: list
}
