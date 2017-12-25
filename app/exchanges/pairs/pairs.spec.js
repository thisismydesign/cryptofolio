const sandbox = require('sinon').createSandbox()
const expect = require('chai').expect

const crypto_exchange_wrapper = require('../crypto_exchange_wrapper')
const pairs = require('./pairs')


describe('pairs module', () => {
	describe('router', () => {
		it('exports a function', () => {
			expect(pairs.router).to.be.a('function')
		}),

		describe('GET /:name/pairs', () => {
			before(() => {
				pair_list = ["BTC_USDT", "LTC_USDT"]
				app = require('supertest').agent(require('../../../app'))

				sandbox.stub(crypto_exchange_wrapper, 'pairs').callsFake(() =>  {
					return new Promise((resolve, reject) => {
				    	resolve(pair_list)
				    })
				})
			})

			after(() => {
				sandbox.restore()
			})

			it('responds with a list of pairs for given exchange', function(done) {
				app.get('/api/exchanges/bittrex/pairs')
		        	.expect(200, function (err, res) {
			        	if (err) {
			        		console.log(res)
			        		throw(err)
			        	}
				        expect(res.body).to.eql(pair_list)
				        done()
				      })
	    	})
		})
	})
})
