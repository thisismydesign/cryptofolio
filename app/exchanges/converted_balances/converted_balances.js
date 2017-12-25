const express = require('express')
const router = express.Router()

const crypto_exchange_wrapper = require('../crypto_exchange_wrapper')
const balances = require('../balances')
const pairs = require('../pairs')

router.get('/:name/balances/:key/:secret/:currency', function(req, res) {
	list(req.params.name, req.params.key, req.params.secret, req.params.currency).then(function(result) {
		res.status(200).json(result);
	})
})

function list(exchange, key, secret, to_currency) {
	return Promise.all([pairs.list(exchange), balances.list(exchange, key, secret)]).then(([pair_list, balance_list]) => {
		Object.keys(balance_list).map(function(currency, index) {
			pair = find_pair(pair_list, currency, to_currency)
			balance_list[currency][`to_${to_currency}_pair`] = pair
		})
		return balance_list
	})
}

function to_usd_pair(pairs, currency) {
  pair = find_pair(pairs, currency, 'USD') || find_pair(pairs, currency, 'USDT')
  return pair
}

function find_pair(pairs, currency_1, currency_2) {
  for (var i in pairs) {
    pair = pairs[i].split('_')
    if (pair[0] == currency_1 && pair[1] == currency_2) {
      return pairs[i]
    }
  }
}

module.exports = {
	router: router,
	list: list
}
