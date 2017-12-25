const crypto_exchange = require('crypto-exchange')

function pairs(exchange) {
	return crypto_exchange[exchange].pairs()
}

function assets(exchange) {
	return crypto_exchange[exchange].assets()
}

function exchanges() {
	return Object.keys(crypto_exchange)
}

module.exports = {
	pairs: pairs,
	assets: assets,
	exchanges: exchanges
}
