process.env.NODE_ENV = 'test'

const sandbox = require('sinon').createSandbox()
const expect = require('chai').expect

const crypto_exchange_wrapper = require('../crypto_exchange_wrapper')
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
				expected_balance_list['BTC']['conversion_pairs'] = [`BTC_${target_currency}`]
				expected_balance_list['BTC']['value'] = 2000
				expected_balance_list['LTC']['conversion_pairs'] = [`LTC_${target_currency}`]
				expected_balance_list['LTC']['value'] = 30000

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
				ticker_stub = sandbox.stub(crypto_exchange_wrapper, 'ticker').withArgs('bittrex', 'BTC_USDT').returns(
					new Promise((resolve, reject) => {
				    	resolve({"BTC_USDT" : {"last": 1000}})
				    })
				).withArgs('bittrex', 'LTC_USDT').returns(
					new Promise((resolve, reject) => {
				    	resolve({"LTC_USDT" : {"last": 300}})
				    })
				)
			})

			after(() => {
				sandbox.restore()
			})

			it('responds with a list of balances for given exchange user including value conversion pairs for desired currency', function(done) {
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

	    	describe('multi-step conversion', () => {
	    		before(() => {
	    			target_currency = 'USDT'
					balance_list = {"XVG": {"balance": 100}}
					pair_list = [`BTC_${target_currency}`, 'XVG_BTC']

	    			expected_balance_list = deep_clone(balance_list)
					expected_balance_list['XVG']['conversion_pairs'] = [`XVG_BTC`, `BTC_${target_currency}`]
					expected_balance_list['XVG']['value'] = 1

					ticker_stub.withArgs('bittrex', 'XVG_BTC').returns(
						new Promise((resolve, reject) => {
				    		resolve({"XVG_BTC" : {"last": 0.00001}})
				    }))
	    		})

	    		it('uses multiple conversion pairs to convert currency', function(done) {
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

	    	describe('one way pair (e.g. looking for USDT_BTC but there is only BTC_USDT)', () => {
	    		before(() => {
	    			target_currency = 'BTC'
	    			balance_list = {"USDT": {"balance": 3000}}

	    			expected_balance_list = deep_clone(balance_list)
					expected_balance_list['USDT']['conversion_pairs'] = ['BTC_USDT']
					expected_balance_list['USDT']['value'] = 3
	    		})

	    		it('uses the revert pair to to convert', function(done) {
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

	    	describe('no conversion needed (e.g. USDT_USDT)', () => {
	    		before(() => {
	    			target_currency = 'USDT'
	    			balance_list = {"USDT": {"balance": 3000}}

	    			expected_balance_list = deep_clone(balance_list)
					expected_balance_list['USDT']['conversion_pairs'] = []
					expected_balance_list['USDT']['value'] = 3000
	    		})

	    		it('uses the balance as value', function(done) {
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
})
