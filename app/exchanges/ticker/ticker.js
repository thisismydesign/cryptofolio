const express = require('express')
const router = express.Router()

const crypto_exchange_wrapper = require('../crypto_exchange_wrapper')

router.get('/:name/ticker/:pair', function(req, res) {
  value(req.params.name, req.params.pair).then(function(result) {
    	res.status(200).json(result);
  	})
})

function value(exchange, pair) {
	return crypto_exchange_wrapper.ticker(exchange, pair)
}

function last_value(exchange, pair) {
	return crypto_exchange_wrapper.ticker(exchange, pair).then(ticker => { return ticker[pair]['last'] })
}

module.exports = {
	router: router,
	value: value,
	last_value: last_value
}
