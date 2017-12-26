const ticker = require('./ticker')

module.exports = {
	router: ticker.router,
	value: ticker.value,
	last_value: ticker.last_value
}
