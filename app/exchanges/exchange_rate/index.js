var exchange_rate = require('./exchange_rate')

module.exports = {
	router: exchange_rate.router,
	convert: exchange_rate.convert,
	find_conversion_pairs: exchange_rate.find_conversion_pairs
}
