const express = require('express')
const router = express.Router()

const crypto_exchange_wrapper = require('../crypto_exchange_wrapper')

router.get('/:name/balances/:key/:secret', function(req, res) {
	list(req.params.name, req.params.key, req.params.secret).then(function(result) {
		res.status(200).json(filter(result, balance_filter));
	})
})

function list(exchange, key, secret) {
	authenticated_exchange = crypto_exchange_wrapper.authenticate(exchange, key, secret)
	return crypto_exchange_wrapper.balances(authenticated_exchange)
}

function filter(obj, predicate) {
	return Object.keys(obj)
          .filter( key => predicate(obj[key]) )
          .reduce( (res, key) => (res[key] = obj[key], res), {} );
}

function balance_filter(currency) {
	return currency['balance'] > 0
}

module.exports = {
	router: router,
	list: list
}
