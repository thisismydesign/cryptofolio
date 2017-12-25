// Decided to go with a wrapper to ease testing

const crypto_exchange = require('crypto-exchange')

function pairs(exchange) {
	return crypto_exchange[exchange].pairs()
}

function assets(exchange) {
	return crypto_exchange[exchange].assets()
}

module.exports = {
	pairs: pairs,
	assets: assets
}
