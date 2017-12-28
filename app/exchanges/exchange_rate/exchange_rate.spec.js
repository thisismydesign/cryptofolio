process.env.NODE_ENV = 'test'

const sandbox = require('sinon').createSandbox()
const expect = require('chai').expect

const crypto_exchange_wrapper = require('../crypto_exchange_wrapper')
const ticker = require('../ticker')
const exchange_rate = require('./exchange_rate')

describe('exchange_rate module', () => {
	describe('router', () => {
		it('exports a function', () => {
			expect(exchange_rate.router).to.be.a('function')
		})
		describe('REST API', () => {
			beforeEach(() => {
				app = require('supertest').agent(require('../../../app'))

				sandbox.stub(crypto_exchange_wrapper, 'pairs').returns(
					new Promise((resolve, reject) => {
				    	resolve(pairs)
				    })
				)
				ticker_stub = sandbox.stub(crypto_exchange_wrapper, 'ticker')
				pairs && pairs.forEach((pair, index) => {
					ticker_stub.withArgs('bittrex', pair).returns(
						new Promise((resolve, reject) => {
							obj = {}
							obj[pair] = {'last': rates[index]}
					    	resolve(obj)
					    })
					)
				})
			})

			afterEach(() => {
				sandbox.restore()
			})

			describe('GET /:name/exchange_rate/:from_currency/:to_currency', () => {
				describe('single-step conversion', () => {
					before(() => {
						from = 'BTC'
		    			to = 'USDT'
						pairs = [`${from}_${to}`]
						rates = [1000]
					})

					it('responds with the exchange rate between the two currencies', function(done) {
						app.get(`/api/exchanges/bittrex/exchange_rate/${from}/${to}`)
				        	.expect(200, function (err, res) {
					        	if (err) {
					        		console.log(res)
					        		throw(err)
					        	}
						        expect(res.body).to.eql(1000)
						        done()
						      })
			    	})
				})

		    	describe('multi-step conversion', () => {
		    		before(() => {
		    			from = 'XVG'
		    			to = 'USDT'
						pairs = [`${from}_BTC`, `BTC_${to}`]
						rates = [0.00001, 1000]
		    		})

		    		it('multiplies exchange rates of intermediate pairs', function(done) {
						app.get(`/api/exchanges/bittrex/exchange_rate/${from}/${to}`)
				        	.expect(200, function (err, res) {
					        	if (err) {
					        		console.log(res)
					        		throw(err)
					        	}
						        expect(res.body).to.eql(0.01)
						        done()
						      })
	    			})
		    	})

		    	describe('multi-step conversion with multiple options', () => {
		    		before(() => {
		    			from = 'XVG'
		    			to = 'USDT'
						pairs = [`${from}_BTC`, `BTC_${to}`, `${from}_LTC`, `LTC_${to}`, `${from}_ETH`, `ETH_${to}`]
						rates = [0.00001, 1000, 1, 200, 0.00001, 5000]
		    		})

		    		it('will choose the cheapest one', function(done) {
						app.get(`/api/exchanges/bittrex/exchange_rate/${from}/${to}`)
				        	.expect(200, function (err, res) {
					        	if (err) {
					        		console.log(res)
					        		throw(err)
					        	}
						        expect(res.body).to.eql(200)
						        done()
						      })
	    			})
		    	})

		    	describe('one way pair (e.g. looking for USDT_BTC but there is only BTC_USDT)', () => {
		    		before(() => {
		    			from = 'USDT'
		    			to = 'BTC'
		    			pairs = [`${to}_${from}`]
						rates = [1000]
		    		})

		    		it('reverts the existing pair', function(done) {
						app.get(`/api/exchanges/bittrex/exchange_rate/${from}/${to}`)
				        	.expect(200, function (err, res) {
					        	if (err) {
					        		console.log(res)
					        		throw(err)
					        	}
						        expect(res.body).to.eql(0.001)
						        done()
						      })
	    			})
		    	})

		    	describe('no conversion needed (e.g. USDT_USDT)', () => {
		    		before(() => {
		    			from = 'USDT'
		    			to = 'USDT'
		    			pairs = []
						rates = []
		    		})

		    		it('responds with 1', function(done) {
						app.get(`/api/exchanges/bittrex/exchange_rate/${from}/${to}`)
				        	.expect(200, function (err, res) {
					        	if (err) {
					        		console.log(res)
					        		throw(err)
					        	}
						        expect(res.body).to.eql(1)
						        done()
						      })
	    			})
		    	})

		    	describe('no conversion possible (e.g. GRS_USDT with no intermediate pair)', () => {
		    		before(() => {
		    			from = 'GRS'
		    			to = 'USDT'
		    			pairs = [`BTC_${to}`]
						rates = [0.00003]
		    		})

		    		it('responds with empty body', function(done) {
						app.get(`/api/exchanges/bittrex/exchange_rate/${from}/${to}`)
				        	.expect(200, function (err, res) {
					        	if (err) {
					        		console.log(res)
					        		throw(err)
					        	}
						        expect(res.body).to.be.empty
						        done()
						      })
	    			})
		    	})
	    	})

			describe('GET /:name/exchange_pairs/:from_currency/:to_currency', () => {
	    		before(() => {
	    			from = 'XVG'
	    			to = 'USDT'
	    			// TODO: should create input vs output in a nicer way
					pairs = [`${from}_BTC`, `BTC_${to}`, `${from}_LTC`, `LTC_${to}`, `${from}_ETH`, `ETH_${to}`]
					rates = [0.00001, 1000, 1, 200, 0.00001, 5000]

					response = [[[pairs[0], true], [pairs[1], true], rates[0]*rates[1]],
					[[pairs[2], true], [pairs[3], true], rates[2]*rates[3]],
					[[pairs[4], true], [pairs[5], true], rates[4]*rates[5]]]
	    		})

	    		it('responds with empty body', function(done) {
					app.get(`/api/exchanges/bittrex/exchange_pairs/${from}/${to}`)
			        	.expect(200, function (err, res) {
				        	if (err) {
				        		console.log(res)
				        		throw(err)
				        	}
					        expect(res.body).to.eql(response)
					        done()
					      })
    			})

    			describe('no conversion possible (e.g. GRS_USDT with no intermediate pair)', () => {
		    		before(() => {
		    			from = 'GRS'
		    			to = 'USDT'
		    			pairs = [`BTC_${to}`]
						rates = [0.00003]
		    		})

		    		it('responds with empty body', function(done) {
						app.get(`/api/exchanges/bittrex/exchange_pairs/${from}/${to}`)
				        	.expect(200, function (err, res) {
					        	if (err) {
					        		console.log(res)
					        		throw(err)
					        	}
						        expect(res.body).to.be.empty
						        done()
						      })
	    			})
		    	})
			})
		})
	})
})
