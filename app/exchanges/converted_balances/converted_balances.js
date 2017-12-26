const express = require('express')
const router = express.Router()

const balances = require('../balances')
const pairs = require('../pairs')
const ticker = require('../ticker')
const exchange_rate = require('../exchange_rate')

router.get('/:name/balances/:key/:secret/:currency', function(req, res) {
	list(req.params.name, req.params.key, req.params.secret, req.params.currency).then(function(result) {
		res.status(200).json(result);
	})
})

function list(exchange, key, secret, to_currency) {
	return Promise.all([pairs.list(exchange), balances.list(exchange, key, secret)]).then(([pair_list, balance_list]) => {
		promises = []

		Object.keys(balance_list).map(function(currency, index) {
			promise = exchange_rate.convert(exchange, pair_list, currency, to_currency).then(multiplier => {
				balance_list[currency]['value'] = balance_list[currency]['balance'] * multiplier
			})
			promises.push(promise)
		})

		return Promise.all(promises).then(() => { return balance_list })
	})
}

module.exports = {
	router: router,
	list: list
}
