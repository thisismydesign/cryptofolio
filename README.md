# cryptofolio

## JS framework for dummies

- [Node.js](https://nodejs.org/en/): JavaScript framework
- [Express](http://expressjs.com/): Node.js web framework
- [Pug](https://github.com/pugjs/pug): Node.js template engine
- [MEAN](http://mean.io/): Said to be a framework but really is just a recommended JavaScript software bundle
- [Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction): CI, deployment and operation

Creating the project:
- Genrate project: http://expressjs.com/en/starter/generator.html
- Initialize repo
- Add gitignore: https://github.com/github/gitignore/blob/master/Node.gitignore
- Add README
- Run `npm install`

Structuring the project:
- There's no consensus (e.g. [1](https://www.infoworld.com/article/3204205/node-js/7-keys-to-structuring-your-nodejs-app.html), [2](https://blog.risingstack.com/node-hero-node-js-project-structure-tutorial/)) but it doesn't matter from the framework point of view. I've decided to structure the project as described [here](https://blog.risingstack.com/node-hero-node-js-project-structure-tutorial/). The main idea (similar to [Angular's generator](https://github.com/angular/angular-cli#generating-components-directives-pipes-and-services)) is to organize around features, not roles. Additionally I will store the business logic in an `app` folder.

Technical notes:

- In order for `sinon` stubbing to work the stubbed method cannot be used in the same module. In other words stubbing a module endpoint will only stub the module endpoint and not the internal usage of the method referenced upon `module.exports`. See more [here](https://stackoverflow.com/a/47949094/2771889).
