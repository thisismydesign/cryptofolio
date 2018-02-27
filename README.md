# Cryptofolio

REST service to query currency and account data on Cryptocurrency Exchanges using the [`crypto-exchange`](https://www.npmjs.com/package/crypto-exchange) npm package.

*__I no longer maintain this project.__ It was made in an attempt to practice JS based frameworks. Find getting started guides, best practices and lessons learned [below](#javascript-stack-for-dummies).*

## Features

- Get list of exchanges, assets, trading pairs and tickers
- Get account balances and sum in custom currency (only [`key-secret` format](https://www.npmjs.com/package/crypto-exchange#authenticated-methods) is supported)
- Get means and prices to exchange currencies including multi-step solutions (find the cheapest one)

## Usage

- `npm install`
- `npm test`
- `npm start`

### API

`npm test | grep -A 1 GET` and possible manual entries marked with `x`

```
GET /:name/assets
  ✓ responds with a list of assets for given exchange

GET /:name/balances/:key/:secret
  ✓ responds with a list of balances for given exchange user

GET /:name/balances/:key/:secret/:currency
  ✓ responds with a list of balances for given exchange user including conversion pairs for and value in desired currency

GET /:name/exchange_pairs/:from_currency/:to_currency
  ✓ responds with a list of exchange pairs and their exchange multiplier

GET /
  ✓ responds with a list of exchanges

GET /:name/pairs
  ✓ responds with a list of pairs for given exchange

GET /:name/ticker/:pair
  ✓ responds with the ticker for given pair

GET /:name/balances/:key/:secret/:currency/sum
  x responds with balance sum in desired currency
```

## JavaScript stack for dummies

- [Node.js](https://nodejs.org/en/): JavaScript framework
- [Express](http://expressjs.com/): Node.js web framework
- [Pug](https://github.com/pugjs/pug): Node.js template engine
- [MEAN](http://mean.io/): Said to be a framework but really is just a recommended JavaScript software bundle
- [Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction): CI, deployment and operation
- See `devDependencies` in [package.json](package.json) for useful libs

- [React](https://reactjs.org/): Frontend framework
- [Redux](https://redux.js.org/): State container
- [Atomic design](http://bradfrost.com/blog/post/atomic-web-design/): set of design principles
- [Flow](https://flow.org/): Static type checker

#### Creating the project
- [Genrate project skeleton](http://expressjs.com/en/starter/generator.html)
- Initialize repo
- [Add gitignore](https://github.com/github/gitignore/blob/master/Node.gitignore)
- Add README
- Run `npm install`

#### Structuring the project
- The [Express generator](http://expressjs.com/en/starter/generator.html) creates a familiar skeleton
- There's [no consensus](https://stackoverflow.com/a/47945694/2771889) on the right structure (e.g. [1](https://www.infoworld.com/article/3204205/node-js/7-keys-to-structuring-your-nodejs-app.html), [2](https://blog.risingstack.com/node-hero-node-js-project-structure-tutorial/)) but it doesn't matter from the framework's point of view.
- The project is structured as described [here](https://blog.risingstack.com/node-hero-node-js-project-structure-tutorial/). The main idea is similar to [Angular's generator](https://github.com/angular/angular-cli#generating-components-directives-pipes-and-services): organize around features, not roles.
- Additionally
  - business logic is stored in an `app` folder
  - the `routes` folder is removed from the project root and instead routes are defined in their corresponding components

#### Technical notes
- In order for `sinon` stubbing to work the stubbed method cannot be used in the same module. In other words stubbing a module endpoint will only stub the module endpoint and not the internal usage of the method referenced upon `module.exports`. See more [here](https://stackoverflow.com/a/47949094/2771889).
- Using comments in the `package.json` file as described [here](https://stackoverflow.com/a/14221781/2771889) and [here](https://stackoverflow.com/questions/14221579/how-do-i-add-comments-to-package-json-for-npm-install/14221781#comment50530934_14221781).

#### Best practices
- Always use `let` or `const` before variables ([lesson learned](https://stackoverflow.com/questions/1470488/what-is-the-purpose-of-the-var-keyword-and-when-to-use-it-or-omit-it/48016128#48016128))

#### Guides
- http://taoofcode.net/promise-anti-patterns/
- https://www.codementor.io/mattgoldspink/nodejs-best-practices-du1086jja
- https://blog.risingstack.com/node-hero-node-js-project-structure-tutorial/
- https://blog.risingstack.com/node-hero-node-js-unit-testing-tutorial/
- https://blog.risingstack.com/getting-node-js-testing-and-tdd-right-node-js-at-scale/
- https://blog.risingstack.com/node-js-project-structure-tutorial-node-js-at-scale/
