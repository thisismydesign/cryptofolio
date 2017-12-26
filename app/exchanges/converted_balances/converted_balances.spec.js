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
				balance_list = {"BTC": {"balance": 2}, "XVG": {"balance": 100}}
				pair_list = [`BTC_${target_currency}`, 'XVG_BTC']

				// Fastest way to deep clone, lol: https://stackoverflow.com/a/5344074/2771889
				expected_balance_list = JSON.parse(JSON.stringify(balance_list))
				expected_balance_list['BTC']['conversion_pairs'] = [`BTC_${target_currency}`]
				expected_balance_list['BTC']['value'] = 2000
				expected_balance_list['XVG']['conversion_pairs'] = [`XVG_BTC`, `BTC_${target_currency}`]
				expected_balance_list['XVG']['value'] = 1

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
				sandbox.stub(crypto_exchange_wrapper, 'ticker').withArgs('bittrex', 'BTC_USDT').returns(
					new Promise((resolve, reject) => {
				    	resolve({"BTC_USDT" : {"last": 1000}})
				    })
				).withArgs('bittrex', 'XVG_BTC').returns(
					new Promise((resolve, reject) => {
				    	resolve({"XVG_BTC" : {"last": 0.00001}})
				    })
				)
			})

			after(() => {
				sandbox.restore()
			})

			// TODO: separate cases, add case for same exchange value
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

	    	describe('one way pair (e.g. USDT_BTC)', () => {
	    		before(() => {
	    			target_currency = 'BTC'
	    			balance_list = {"USDT": {"balance": 3000}}

	    			expected_balance_list = JSON.parse(JSON.stringify(balance_list))
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
		})
	})
})
