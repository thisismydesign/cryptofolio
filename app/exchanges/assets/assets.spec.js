const proxyquire =  require('proxyquire').noCallThru()
const sinon = require('sinon')

var exchnage_stub = sinon.stub()
exchnage_stub.assets = () =>  {
	return new Promise((resolve, reject) => {
    	resolve(["BTC","LTC"])
    })
}

let crypto_exchange_stub = {}
crypto_exchange_stub.bittrex = () => { return exchnage_stub }

const assets = proxyquire('./assets', { 'crypto-exchange': crypto_exchange_stub })
const expect = require('chai').expect

describe('assets module', () => {
	describe('router', () => {
		it('exports a function', () => {
			expect(assets.router).to.be.a('function')
		}),
		describe('GET /:name/assets', () => {
			it('responds with a list of assets for given exchange', function(done) {
				const agent = require('supertest').agent(require('../../../app'))
				agent
			        .get('/api/exchanges/bittrex/assets')
			        .expect(200, function (err, res) {
			        	if (err) {
			        		console.log(res)
			        		throw(err)
			        	}
				        expect(res.body).to.eql(["BTC","LTC"])
				        done()
				      })
	    	})
		})
	})
})
