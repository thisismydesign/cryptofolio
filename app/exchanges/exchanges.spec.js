const sinon = require('sinon')
const expect = require('chai').expect

const crypto_exchange_wrapper = require('./crypto_exchange_wrapper')
const exchanges = require('./exchanges')

describe('exchanges module', () => {
	describe('router', () => {
		it('exports a function', () => {
			expect(exchanges.router).to.be.a('function')
		}),
		describe('GET /', () => {
			before(() => {
				exchange_list = ['bittrex', 'coinbase']
				app = require('supertest').agent(require('../../app'))

				sinon.stub(crypto_exchange_wrapper, 'exchanges').callsFake(() =>  {
					return exchange_list
				})
			})

			it('responds with a list of exchanges', function(done) {
				app.get('/api/exchanges')
			        .expect(200, function (err, res) {
			        	if (err) {
			        		console.log(err)
			        		throw(err)
			        	}
				        expect(res.body).to.eql(exchange_list)
				        done()
				      })
	    	})
		})
	})
})
