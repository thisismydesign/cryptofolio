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

function authenticate(exchange, key, secret) {
	return new crypto_exchange[exchange]({
	    key: key,
	    secret: secret
	})
}

function balances(authenticated_exchange) {
	return authenticated_exchange.balances()
}

module.exports = {
	pairs: pairs,
	assets: assets,
	exchanges: exchanges,
	authenticate: authenticate,
	balances: balances
}
