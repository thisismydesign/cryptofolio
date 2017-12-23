const express = require('express')
const router = express.Router()

router.get('/', function (req, res) {
  res.status(200).json(list())
})
const exchanges = require('crypto-exchange');

function list() {
	return Object.keys(exchanges)
}

module.exports = {
	router: router,
	list: list
}
