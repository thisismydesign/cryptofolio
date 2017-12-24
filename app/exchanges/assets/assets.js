const crypto_exchange = require('crypto-exchange')
const express = require('express')
const router = express.Router()

router.get('/:name/assets', function(req, res) {
  list(req.params.name).then(function(result) {
    	res.status(200).json(result);
  	})
})

function list(exchange) {
	return crypto_exchange[exchange]().assets()
}

module.exports = {
	router: router,
	list: list
}
