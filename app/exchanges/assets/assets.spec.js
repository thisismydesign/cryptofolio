const sinon = require('sinon')
const expect = require('chai').expect

const crypto_exchange_wrapper = require('../crypto_exchange_wrapper')
const assets = require('./assets')

describe('assets module', () => {
	describe('router', () => {
		it('exports a function', () => {
			expect(assets.router).to.be.a('function')
		}),
		describe('GET /:name/assets', () => {

			before(() => {
				asset_list = ["BTC", "LTC"]
				app = require('supertest').agent(require('../../../app'))

				sinon.stub(crypto_exchange_wrapper, 'assets').callsFake(() =>  {
					return new Promise((resolve, reject) => {
				    	resolve(asset_list)
				    })
				})
			})

			it('responds with a list of assets for given exchange', function(done) {
				app.get('/api/exchanges/bittrex/assets')
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
