// Decided to go with a wrapper because it's difficult to test using `crypto-exchange`

const crypto_exchange = require('crypto-exchange')

function pairs(exchange) {
	return crypto_exchange[exchange].pairs()
}

module.exports = {
	pairs: pairs
}
