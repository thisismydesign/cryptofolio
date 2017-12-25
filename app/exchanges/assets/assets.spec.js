const proxyquire =  require('proxyquire')
const sinon = require('sinon')

const exchange_stub = sinon.stub()
const crypto_exchange_stub = {}

const assets = proxyquire('./assets', { 'crypto-exchange': crypto_exchange_stub })
const expect = require('chai').expect

describe('assets module', () => {
	describe('router', () => {
		it('exports a function', () => {
			expect(assets.router).to.be.a('function')
		}),
		describe('GET /:name/assets', () => {

			before(() => {
				asset_list = ["BTC", "LTC"]
				exchange_stub.assets = () =>  {
					return new Promise((resolve, reject) => {
				    	resolve(asset_list)
				    })
				}
				crypto_exchange_stub.bittrex = exchange_stub
				app = require('supertest').agent(require('../../../app'))
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
