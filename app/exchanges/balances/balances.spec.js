const sinon = require('sinon')
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
				balance_list = ["BTC", "LTC"]
				app = require('supertest').agent(require('../../../app'))

				sinon.stub(crypto_exchange_wrapper, 'authenticate').callsFake(() => null)
				sinon.stub(crypto_exchange_wrapper, 'balances').callsFake(() =>  {
					return new Promise((resolve, reject) => {
				    	resolve(asset_list)
				    })
				})
			})

			it('responds with a list of balances for given exchange user', function(done) {
				app.get('/api/exchanges/bittrex/balances/abc/123')
		        	.expect(200, function (err, res) {
			        	if (err) {
			        		console.log(res)
			        		throw(err)
			        	}
				        expect(res.body).to.eql(asset_list)
				        done()
				      })
	    	})
		})
	})
})
