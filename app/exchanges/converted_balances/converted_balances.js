const express = require('express')
const router = express.Router()

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
			conversion_pairs = find_conversion_pairs(pair_list, currency, to_currency)
			if (conversion_pairs) {
				balance_list[currency]['conversion_pairs'] = []
				balance_list[currency]['value'] = balance_list[currency]['balance']

				conversion_pairs.forEach(([pair, direction]) => {
					promises.push(convert_entry(exchange, pair, currency, balance_list, direction))
				})
			}
		})

		return Promise.all(promises).then(() => { return balance_list })
	})
}

function convert_entry(exchange, pair, start_currency, balance_list, direction = true) {
	balance_list[start_currency]['conversion_pairs'].push(pair)
	return ticker.last_value(exchange, pair).then(result => {
		if (direction) {
			return balance_list[start_currency]['value'] *= result
		} else {
			return balance_list[start_currency]['value'] /= result
		}
	})
}

function find_conversion_pairs(pairs, from_currency, to_currency) {
	intermediate_currency = 'BTC'

	// e.g. from: USDT to: USDT
	if(from_currency === to_currency) return []

	// e.g. from: BTC to: USDT, pair: BTC_USDT
	pair = find_pair(pairs, from_currency, to_currency)
	if (pair) return [[pair, true]]

	// e.g. from: USDT to: BTC, pair: BTC_USDT
	reverse_pair = find_pair(pairs, to_currency, from_currency)
	if (reverse_pair) return [[reverse_pair, false]]

	// e.g. from: XVG to: USDT, pairs: XVG_BTC, BTC_USDT
	intermediate_pair = find_pair(pairs, from_currency, intermediate_currency)
	pair = find_pair(pairs, intermediate_currency, to_currency)
	if (intermediate_pair && pair) return [[intermediate_pair, true], [pair, true]]

	console.log(`No pairs found to change from ${from_currency} to ${to_currency}`)
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
