const sandbox = require('sinon').createSandbox()
const expect = require('chai').expect

const crypto_exchange_wrapper = require('../crypto_exchange_wrapper')
const balances = require('./balances')

describe('balances module', () => {
	describe('router', () => {
		it('exports a function', () => {
			expect(balances.router).to.be.a('function')
		}),
		describe('GET /:name/balances/:key/:secret', () => {
			before(() => {
				balance_list = {"BTC": {
								    "balance": 0.08126211,
								    "available": 0.08126211,
								    "pending": 0
								  },
								  "LTC" : {
								  	"balance": 2500,
								    "available": 2500,
								    "pending": 0
								  }
								}
				app = require('supertest').agent(require('../../../app'))

				sandbox.stub(crypto_exchange_wrapper, 'authenticate').callsFake(() => null)
				sandbox.stub(crypto_exchange_wrapper, 'balances').callsFake(() =>  {
					return new Promise((resolve, reject) => {
				    	resolve(balance_list)
				    })
				})
			})

			after(() => {
				sandbox.restore()
			})

			it('responds with a list of balances for given exchange user', function(done) {
				app.get('/api/exchanges/bittrex/balances/abc/123')
		        	.expect(200, function (err, res) {
			        	if (err) {
			        		console.log(res)
			        		throw(err)
			        	}
				        expect(res.body).to.eql(balance_list)
				        done()
				      })
	    	})

	    	it('filters empty balances', function(done) {
	    		balance_list = {"BTC": {
								    "balance": 0.08126211,
								    "available": 0.08126211,
								    "pending": 0
								  },
								  "ETH" : {
								  	"balance": 0,
								    "available": 0,
								    "pending": 0
								  }
								}
				filtered_balance_list = balance_list
				delete filtered_balance_list['ETH']
				app.get('/api/exchanges/bittrex/balances/abc/123')
		        	.expect(200, function (err, res) {
			        	if (err) {
			        		console.log(res)
			        		throw(err)
			        	}
				        expect(res.body).to.eql(filtered_balance_list)
				        done()
				      })
	    	})
		})
	})
})
