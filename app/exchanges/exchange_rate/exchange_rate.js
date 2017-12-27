const express = require('express')
const router = express.Router()

const pairs = require('../pairs')
const ticker = require('../ticker')

router.get('/:name/exchange_rate/:from_currency/:to_currency', function(req, res) {
	convert(req.params.name, req.params.from_currency, req.params.to_currency).then(function(result) {
		res.status(200).json(result);
	})
})

function convert(exchange, from_currency, to_currency) {
	return pairs.list(exchange).then(pair_list => {
		conversion_pairs = find_conversion_pairs(pair_list, from_currency, to_currency)
		if(!conversion_pairs) return
		return cheapest(exchange, conversion_pairs).then(result => {return result})
	})
}

function cheapest(exchange, possible_conversion_pairs) {
	possible_promises = []
	possible_conversion_pairs.forEach((conversion_pairs, index) => {
		promises = []
		conversion_pairs.forEach(([pair, direction]) => {
			promises.push(conversion_multiplier(exchange, pair, direction))
		})
		possible_promises.push(Promise.all(promises).then(multipliers => { multipliers.push(1); return multipliers.reduce((a, b) => a * b) }))
	})
	return Promise.all(possible_promises).then((multipliers) => { return max(multipliers) })
}

function max(arr) {
	return arr.reduce((a, b) => { return Math.max(a, b) })
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
	if(from_currency === to_currency) return [[]]

	// e.g. from: BTC to: USDT, pair: BTC_USDT
	pair = find_pair(pairs, from_currency, to_currency)
	if (pair) return [[[pair, true]]]

	// e.g. from: USDT to: BTC, pair: BTC_USDT
	reverse_pair = find_pair(pairs, to_currency, from_currency)
	if (reverse_pair) return [[[reverse_pair, false]]]

	// e.g. from: XVG to: USDT, pairs: XVG_BTC, BTC_USDT
	multiple_pairs = intersecting_pairs(find_from_pairs(pairs, from_currency), find_to_pairs(pairs, to_currency))
	multiple_pairs.forEach(([from_pair, to_pair], index) => {
		multiple_pairs[index] = [[from_pair, true], [to_pair, true]]
	})
	if (multiple_pairs.length > 0) return multiple_pairs

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

function find_intermediate_pairs(pairs, from_currency, to_currency) {
	to_pairs = find_to_pairs(pairs, to_currency)
	from_pairs = find_from_pairs(pairs, from_currency)

}

function intersecting_pairs(from_pairs, to_pairs) {
	ret = []
	to_pairs.forEach(to_pair => {
		from_pairs.forEach(from_pair => {
			if (to_pair.split('_')[0] === from_pair.split('_')[1]) ret.push([from_pair, to_pair])
		})
	})
	return ret
}

function find_to_pairs(pairs, to_currency) {
	to_pairs = []
  for (var i in pairs) {
    pair = pairs[i].split('_')
    if (pair[1] == to_currency) {
      to_pairs.push(pairs[i])
    }
  }
  return to_pairs
}

function find_from_pairs(pairs, from_currency) {
	from_pairs = []
  for (var i in pairs) {
    pair = pairs[i].split('_')
    if (pair[0] == from_currency) {
      from_pairs.push(pairs[i])
    }
  }
  return from_pairs
}

module.exports = {
	router: router,
	convert: convert,
	find_conversion_pairs: find_conversion_pairs
}
