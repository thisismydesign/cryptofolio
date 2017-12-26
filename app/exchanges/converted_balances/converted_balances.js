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

		Object.keys(balance_list).map(function(from_currency, index) {
			pair = find_pair(pair_list, from_currency, to_currency)
			if (pair) {
				balance_list[from_currency][`to_${to_currency}_pair`] = pair
				promise = ticker.last_value(exchange, pair).then(result => {
					console.log(result)
					balance_list[from_currency][`${to_currency}_value`] = result
				})
				promises.push(promise)
			}
		})

		return Promise.all(promises).then(() => { return balance_list })
	})
}

function to_usd_pair(pairs, currency) {
  pair = find_pair(pairs, currency, 'USD') || find_pair(pairs, currency, 'USDT')
  return pair
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
