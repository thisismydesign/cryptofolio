'use strict'

const exchanges = require('./exchanges')
const expect = require('chai').expect

describe('exchanges module', () => {
	describe('router', () => {
		it('should export a function', () => {
			expect(exchanges.router).to.be.a('function')
		})
	})
})
