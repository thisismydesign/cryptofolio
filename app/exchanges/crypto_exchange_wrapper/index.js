// Decided to go with a wrapper to ease testing

const crypto_exchange_wrapper = require('./crypto_exchange_wrapper')

module.exports = {
	pairs: crypto_exchange_wrapper.pairs,
	assets: crypto_exchange_wrapper.assets,
	exchanges: crypto_exchange_wrapper.exchanges
}
