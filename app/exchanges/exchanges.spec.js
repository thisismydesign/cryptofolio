const proxyquire =  require('proxyquire').noCallThru()
const crypto_exchange_stub = {bittrex:null, coinbase:null}
const exchanges = proxyquire('./exchanges', { 'crypto-exchange': crypto_exchange_stub })
const expect = require('chai').expect

describe('exchanges module', () => {
	describe('router', () => {
		it('exports a function', () => {
			expect(exchanges.router).to.be.a('function')
		}),
		describe('GET /', () => {
			it('responds with a list of exchanges', function(done) {
				const agent = require('supertest').agent(require('../../app'))
				agent
			        .get('/api/exchanges')
			        .expect(200, function (err, res) {
				        expect(res.body).to.eql(['bittrex', 'coinbase'])
				        done()
				      })
	    	})
		})
	})
})
