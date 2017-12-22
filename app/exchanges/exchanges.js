const express = require('express')
const router = express.Router()

router.get('/', function (req, res) {
  res.status(200).json(list())
})

function list() {
	return ['bittrex', 'coinbase']
}

module.exports = {
	router: router,
	list: list
}
