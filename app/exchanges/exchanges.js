const exchanges = require('crypto-exchange');

function list() {
	return Object.keys(exchanges)
}

module.exports = {
	list: list
}
