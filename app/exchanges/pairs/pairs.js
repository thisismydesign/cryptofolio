const express = require('express')
const router = express.Router()

const crypto_exchange_wrapper = require('../crypto_exchange_wrapper')

router.get('/:name/pairs', function(req, res) {
  list(req.params.name).then(function(result) {
    	res.status(200).json(result);
  	})
})

function list(exchange) {
	return crypto_exchange_wrapper.pairs(exchange)
}

module.exports = {
	router: router,
	list: list
}
