const express = require('express')
const router = express.Router()

const converted_balances = require('../converted_balances')

router.get('/:name/balances/:key/:secret/:currency/sum', function(req, res) {
  value(req.params.name, req.params.key, req.params.secret, req.params.currency).then(function(sum) {
		res.status(200).json(sum);
	})
})

function value(exchange, key, secret, to_currency) {
	sum = 0
	return converted_balances.list(exchange, key, secret, to_currency).then(balance_list => {
		Object.keys(balance_list).forEach(currency => {
			sum += balance_list[currency]['value']
		})
		return sum
	})
}

module.exports = {
	router: router
}
