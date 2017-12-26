const express = require('express')
const router = express.Router()

const pairs = require('../pairs')
const ticker = require('../ticker')

router.get('/:name/exchange_rate/:from_currency/:to_currency', function(req, res) {
	value(req.params.name, req.params.from_currency, req.params.to_currency).then(function(result) {
		res.status(200).json(result);
	})
})

function value(exchange, from_currency, to_currency) {
	return pairs.list(exchange).then(pair_list => {
		return convert(exchange, pair_list, from_currency, to_currency)
	})
}

function convert(exchange, pair_list, from_currency, to_currency) {
	let multiplier, promises = []
	conversion_pairs = find_conversion_pairs(pair_list, from_currency, to_currency)
	if(conversion_pairs) {
		multiplier = 1
		conversion_pairs.forEach(([pair, direction]) => {
			promise = conversion_multiplier(exchange, pair, direction).then(result => {
				// console.log(result)
				multiplier *= result
			})
			promises.push(promise)
		})
	}
	return Promise.all(promises).then(() => { return multiplier })
}

function conversion_multiplier(exchange, pair, direction) {
	return ticker.last_value(exchange, pair).then(result => {
		if (direction) {
			return result
		} else {
			return 1 / result
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
	router: router
}
