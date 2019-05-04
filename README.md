# Cryptofolio

#### REST service to query currency and account data on Cryptocurrency Exchanges using the [`crypto-exchange`](https://www.npmjs.com/package/crypto-exchange) npm package.

Status and support

- &#x2714; stable
- &#x2716; not supported
- &#x2716; no ongoing development

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

## Conventions

This project follows [C-Hive guides](https://github.com/c-hive/guides) for code style, way of working and other development concerns.

## Technical notes
- In order for `sinon` stubbing to work the stubbed method cannot be used in the same module. In other words stubbing a module endpoint will only stub the module endpoint and not the internal usage of the method referenced upon `module.exports`. See more [here](https://stackoverflow.com/a/47949094/2771889).
