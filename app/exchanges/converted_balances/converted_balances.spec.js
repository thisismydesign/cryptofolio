const sandbox = require('sinon').createSandbox()
const expect = require('chai').expect

const crypto_exchange_wrapper = require('../crypto_exchange_wrapper')
const converted_balances = require('./converted_balances')

describe('converted_balances module', () => {
	describe('router', () => {
		it('exports a function', () => {
			expect(converted_balances.router).to.be.a('function')
		}),
		describe('GET /:name/balances/:key/:secret/:currency', () => {
			before(() => {
				balance_list = {"BTC": {
								    "balance": 0.08126211,
								    "available": 0.08126211,
								    "pending": 0
								}}
				pair_list = ["BTC_USDT", "LTC_USDT"]
				expected_balance_list = balance_list
				expected_balance_list['BTC']['to_USDT_pair'] = 'BTC_USDT'

				app = require('supertest').agent(require('../../../app'))

				sandbox.stub(crypto_exchange_wrapper, 'authenticate').callsFake(() => null)
				sandbox.stub(crypto_exchange_wrapper, 'balances').callsFake(() =>  {
					return new Promise((resolve, reject) => {
				    	resolve(balance_list)
				    })
				})
				sandbox.stub(crypto_exchange_wrapper, 'pairs').callsFake(() =>  {
					return new Promise((resolve, reject) => {
				    	resolve(pair_list)
				    })
				})
			})

			after(() => {
				sandbox.restore()
			})

			it('responds with a list of converted_balances for given exchange', function(done) {
				app.get('/api/exchanges/bittrex/balances/abc/123/USDT')
		        	.expect(200, function (err, res) {
			        	if (err) {
			        		console.log(res)
			        		throw(err)
			        	}
				        expect(res.body).to.eql(expected_balance_list)
				        done()
				      })
	    	})
		})
	})
})
