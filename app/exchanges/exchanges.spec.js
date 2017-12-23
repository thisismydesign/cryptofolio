const index = require('./index')
const exchanges = require('./exchanges')
const expect = require('chai').expect
const sinon = require('sinon');

describe('exchanges module', () => {
	describe('router', () => {
		it('exports a function', () => {
			expect(index.router).to.be.a('function')
		}),
		describe('GET /', () => {
			it('responds with a list of exchanges', function(done) {
				sinon.stub(exchanges, 'list').callsFake(() => ['bittrex', 'coinbase'])
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
