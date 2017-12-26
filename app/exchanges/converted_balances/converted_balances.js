const express = require('express')
const router = express.Router()

const crypto_exchange_wrapper = require('../crypto_exchange_wrapper')
const balances = require('../balances')
const pairs = require('../pairs')
const ticker = require('../ticker')

router.get('/:name/balances/:key/:secret/:currency', function(req, res) {
	list(req.params.name, req.params.key, req.params.secret, req.params.currency).then(function(result) {
		res.status(200).json(result);
	})
})

function list(exchange, key, secret, to_currency) {
	return Promise.all([pairs.list(exchange), balances.list(exchange, key, secret)]).then(([pair_list, balance_list]) => {
		promises = []

		Object.keys(balance_list).map(function(currency, index) {
			balance_list[currency][`to_${to_currency}_pairs`] = []
			balance_list[currency][`${to_currency}_value`] = balance_list[currency]['balance']

			if(currency === to_currency) return

			pair = find_pair(pair_list, currency, to_currency)
			if (pair) {
				balance_list[currency][`to_${to_currency}_pairs`].push(pair)
				promise = ticker.last_value(exchange, pair).then(result => {
					balance_list[currency][`${to_currency}_value`] *= result
				})
				promises.push(promise)
			} else {
				// Change through intermediate currency
				intermediate_currency = 'BTC'

				intermediate_pair = find_pair(pair_list, currency, intermediate_currency)
				if (!intermediate_pair) {
					console.log(`No pairs found to change from ${currency} to ${to_currency}`)
					balance_list[currency][`${to_currency}_value`] = 0
					return
				}
				balance_list[currency][`to_${to_currency}_pairs`].push(intermediate_pair)
				intermediate_promise = ticker.last_value(exchange, intermediate_pair).then(result => {
					balance_list[currency][`${to_currency}_value`] *= result
				})
				promises.push(intermediate_promise)


				pair = find_pair(pair_list, intermediate_currency, to_currency)
				balance_list[currency][`to_${to_currency}_pairs`].push(pair)

				promise = ticker.last_value(exchange, pair).then(result => {
					balance_list[currency][`${to_currency}_value`] *= result
				})
				promises.push(promise)

				console.log(`Cannot change from ${currency} to ${to_currency} directly, will do it through ${balance_list[currency][`to_${to_currency}_pairs`]}`)
			}
		})

		return Promise.all(promises).then(() => { return balance_list })
	})
}

function find_pair(pairs, from_currency, to_currency) {
  for (var i in pairs) {
    pair = pairs[i].split('_')
    if (pair[0] == from_currency && pair[1] == to_currency) {
      return pairs[i]
    }
  }
}

module.exports = {
	router: router,
	list: list
}
