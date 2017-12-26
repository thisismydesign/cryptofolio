process.env.NODE_ENV = 'test'

const sandbox = require('sinon').createSandbox()
const expect = require('chai').expect

const crypto_exchange_wrapper = require('../crypto_exchange_wrapper')
const exchange_rate = require('../exchange_rate')
const converted_balances = require('./converted_balances')

function deep_clone(obj) {
	// Fastest way to deep clone, lol: https://stackoverflow.com/a/5344074/2771889
	return JSON.parse(JSON.stringify(obj))
}

describe('converted_balances module', () => {
	describe('router', () => {
		it('exports a function', () => {
			expect(converted_balances.router).to.be.a('function')
		}),
		describe('GET /:name/balances/:key/:secret/:currency', () => {
			before(() => {
				target_currency = 'USDT'
				balance_list = {"BTC": {"balance": 2}, "LTC": {"balance": 100}}
				pair_list = [`BTC_${target_currency}`, `LTC_${target_currency}`]

				expected_balance_list = deep_clone(balance_list)
				expected_balance_list['BTC']['value'] = 4
				expected_balance_list['LTC']['value'] = 200

				app = require('supertest').agent(require('../../../app'))

				sandbox.stub(crypto_exchange_wrapper, 'authenticate').returns(null)
				sandbox.stub(crypto_exchange_wrapper, 'balances').returns(
					new Promise((resolve, reject) => {
				    	resolve(balance_list)
				    })
				)
				sandbox.stub(crypto_exchange_wrapper, 'pairs').returns(
					new Promise((resolve, reject) => {
				    	resolve(pair_list)
				    })
				)
				sandbox.stub(exchange_rate, 'convert').returns(
					new Promise((resolve, reject) => {
					    	resolve(2)
			    	})
		    	)
			})

			after(() => {
				sandbox.restore()
			})

			it('responds with a list of balances for given exchange user including value in desired currency', function(done) {
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
