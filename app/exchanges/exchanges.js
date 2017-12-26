const express = require('express')
const router = express.Router()

const crypto_exchange = require('./crypto_exchange_wrapper')
const assets = require('./assets')
const pairs = require('./pairs')
const balances = require('./balances')
const ticker = require('./ticker')
const converted_balances = require('./converted_balances')
const converted_sum = require('./converted_sum')

router.get('/', function (req, res) {
  res.status(200).json(list())
})
router.use('/', assets.router)
router.use('/', pairs.router)
router.use('/', balances.router)
router.use('/', ticker.router)
router.use('/', converted_balances.router)
router.use('/', converted_sum.router)

function list() {
	return crypto_exchange.exchanges()
}

module.exports = {
	router: router,
	list: list
}
