const express = require('express')
const router = express.Router()

const crypto_exchange_wrapper = require('../crypto_exchange_wrapper')

router.get('/:name/balances/:key/:secret', function(req, res) {
	list(req.params.name, req.params.key, req.params.secret).then(function(result) {
		res.status(200).json(result);
	})
})

function list(exchange, key, secret) {
	authenticated_exchange = crypto_exchange_wrapper.authenticate(exchange, key, secret)
	return crypto_exchange_wrapper.balances(authenticated_exchange)
}

module.exports = {
	router: router,
	list: list
}
