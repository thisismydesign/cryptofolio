const express = require('express')
const router = express.Router()

const pairs = require('../pairs')
const ticker = require('../ticker')

router.get('/:name/exchange_rate/:from_currency/:to_currency', function(req, res) {
	convert(req.params.name, req.params.from_currency, req.params.to_currency).then(function(result) {
		res.status(200).json(result);
	})
})

router.get('/:name/exchange_pairs/:from_currency/:to_currency', function(req, res) {
	exchange_pairs(req.params.name, req.params.from_currency, req.params.to_currency).then(function(result) {
		res.status(200).json(result);
	})
})

function exchange_pairs(exchange, from_currency, to_currency) {
	return pairs.list(exchange).then(pair_list => {
		let promises = []
		let possible_conversion_pairs = find_conversion_pairs(pair_list, from_currency, to_currency)
		if(!possible_conversion_pairs) return
		possible_conversion_pairs.forEach((conversion_pairs, index) => {
			let promise = get_rate(exchange, conversion_pairs).then(rate => {
				possible_conversion_pairs[index] && possible_conversion_pairs[index].push(rate)
			})
			promises.push(promise)
		})
		return Promise.all(promises).then(() => { return possible_conversion_pairs })
	})
}

function convert(exchange, from_currency, to_currency) {
	return exchange_pairs(exchange, from_currency, to_currency).then(conversion_pairs => {
		if(!conversion_pairs) return
		flat_data = [].concat.apply([], conversion_pairs)
		multipliers = flat_data.filter(value => !isNaN(value))
		return max(multipliers)
	})
}

function get_rate(exchange, conversion_pairs) {
	let promises = []
	conversion_pairs.forEach(([pair, direction]) => {
		promises.push(conversion_multiplier(exchange, pair, direction))
	})
	return Promise.all(promises).then(multipliers => { multipliers.push(1); return multipliers.reduce((a, b) => a * b) })
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
	let intermediate_currency = 'BTC'

	// e.g. from: USDT to: USDT
	if(from_currency === to_currency) return [[]]

	// e.g. from: BTC to: USDT, pair: BTC_USDT
	let pair = find_pair(pairs, from_currency, to_currency)
	if (pair) return [[[pair, true]]]

	// e.g. from: USDT to: BTC, pair: BTC_USDT
	let reverse_pair = find_pair(pairs, to_currency, from_currency)
	if (reverse_pair) return [[[reverse_pair, false]]]

	// e.g. from: XVG to: USDT, pairs: XVG_BTC, BTC_USDT
	let multiple_pairs = intersecting_pairs(find_from_pairs(pairs, from_currency), find_to_pairs(pairs, to_currency))
	multiple_pairs.forEach(([from_pair, to_pair], index) => {
		multiple_pairs[index] = [[from_pair, true], [to_pair, true]]
	})
	if (multiple_pairs.length > 0) return multiple_pairs

	console.log(`No pairs found to change from ${from_currency} to ${to_currency}`)
}

function find_pair(pairs, from_currency, to_currency) {
  for (var i in pairs) {
    let pair = pairs[i].split('_')
    if (pair[0] == from_currency && pair[1] == to_currency) {
      return pairs[i]
    }
  }
}

function find_intermediate_pairs(pairs, from_currency, to_currency) {
	let to_pairs = find_to_pairs(pairs, to_currency)
	let from_pairs = find_from_pairs(pairs, from_currency)

}

function intersecting_pairs(from_pairs, to_pairs) {
	let ret = []
	to_pairs.forEach(to_pair => {
		from_pairs.forEach(from_pair => {
			if (to_pair.split('_')[0] === from_pair.split('_')[1]) ret.push([from_pair, to_pair])
		})
	})
	return ret
}

function find_to_pairs(pairs, to_currency) {
	let to_pairs = []
  for (var i in pairs) {
    let pair = pairs[i].split('_')
    if (pair[1] == to_currency) {
      to_pairs.push(pairs[i])
    }
  }
  return to_pairs
}

function find_from_pairs(pairs, from_currency) {
	let from_pairs = []
  for (var i in pairs) {
    let pair = pairs[i].split('_')
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
