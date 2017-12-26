process.env.NODE_ENV = 'test'

const sandbox = require('sinon').createSandbox()
const expect = require('chai').expect

const crypto_exchange_wrapper = require('../crypto_exchange_wrapper')
const ticker = require('./ticker')

describe('ticker module', () => {
	describe('router', () => {
		it('exports a function', () => {
			expect(ticker.router).to.be.a('function')
		}),
		describe('GET /:name/ticker/:pair', () => {
			before(() => {
				ticker_value = {
					  "BTC_USDT": {
					    "last": 13669.00000004,
					    "ask": 13700,
					    "bid": 13669.00000004,
					    "high": 14331,
					    "low": 12633.11,
					    "volume": 6718.00932196,
					    "timestamp": 1514245151987
					  }
					}
				app = require('supertest').agent(require('../../../app'))

				sandbox.stub(crypto_exchange_wrapper, 'ticker').callsFake(() =>  {
					return new Promise((resolve, reject) => {
				    	resolve(ticker_value)
				    })
				})
			})

			after(() => {
				sandbox.restore()
			})

			it('responds with the ticker for given pair', function(done) {
				app.get('/api/exchanges/bittrex/ticker/BTC_USDT')
		        	.expect(200, function (err, res) {
			        	if (err) {
			        		console.log(res)
			        		throw(err)
			        	}
				        expect(res.body).to.eql(ticker_value)
				        done()
				      })
	    	})
		})
	})
})
