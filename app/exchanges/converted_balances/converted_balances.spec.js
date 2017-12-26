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
				target_currency = 'USDT'
				balance_list = {"BTC": {"balance": 2}}
				ticker_value = {"BTC_USDT" : {"last": 1000}}
				pair_list = [`BTC_${target_currency}`, `LTC_${target_currency}`]

				// Fastest way to deep clone, lol: https://stackoverflow.com/a/5344074/2771889
				expected_balance_list = JSON.parse(JSON.stringify(balance_list))
				expected_balance_list['BTC'][`to_${target_currency}_pair`] = `BTC_${target_currency}`
				expected_balance_list['BTC'][`${target_currency}_value`] = 2000

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
				sandbox.stub(crypto_exchange_wrapper, 'ticker').callsFake(() =>  {
					return new Promise((resolve, reject) => {
				    	resolve(ticker_value)
				    })
				})
			})

			after(() => {
				sandbox.restore()
			})

			it('responds with a list of balances for given exchange user including value and ticker of desired currency', function(done) {
				app.get(`/api/exchanges/bittrex/balances/abc/123/${target_currency}`)
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
