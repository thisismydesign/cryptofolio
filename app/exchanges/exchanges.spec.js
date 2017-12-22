const exchanges = require('./exchanges')
const expect = require('chai').expect
const request = require('supertest');
const express = require('express');

const app = express();
app.use('/', exchanges.router)

describe('exchanges module', () => {
	describe('router', () => {
		it('exports a function', () => {
			expect(exchanges.router).to.be.a('function')
		}),
		describe('GET /', () => {
			it('responds with a list of exchanges', function(done) {
				request(app)
			        .get('/')
			        .expect(200, function (err, res) {
				        expect(res.body).to.eql(['bittrex', 'coinbase'])
				        done()
				      })
	    	})
		})
	})
})
