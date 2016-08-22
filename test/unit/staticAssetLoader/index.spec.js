/**
 * @fileOverview
 * Unit tests for the staticAssetLoader module.
 */

var loader = require('../../../lib/loader');
var namespacer = require('../../../lib/namespacer');
var staticAssetLoaderFactory = require('../../../lib/staticAssetLoader');

describe('lib/staticAssetLoader', function () {

  var assets;
  var assetNames;
  var config;
  var loaderOptions;
  var sandbox;
  var staticAssetLoader;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();

    loaderOptions = {};

    assetNames = [
      'dependency-one@1.0.0',
      'asset-one@1.0.0'
    ];

    assets = {
      'dependency-one@1.0.0': { dependency: 'one' },
      'asset-one@1.0.0': { asset: 'one' }
    };

    config = {
      generateUrl: function (assetNames, namespaceName) {
        var filename = encodeURIComponent(assetNames.slice(0).sort().join('+')) + '.js';

        namespaceName = encodeURIComponent(namespaceName);
        return 'https://static.example.com/1/asset/' + namespaceName + '/' + filename;
      },
      namespaceName: 'EXAMPLE'
    };

    sandbox.stub(loader, 'loadScript');
    sandbox.spy(config, 'generateUrl');

    staticAssetLoader = staticAssetLoaderFactory.create(config);
  });

  afterEach(function () {
    sandbox.restore();
    delete namespacer.namespace(config.namespaceName)._staticAssetRegistry;
  });

  describe('require and define', function () {

    it('basic operation works as expected', function (done) {
      staticAssetLoader.require(assetNames, function (dependencyOne, assetOne) {
        expect(dependencyOne).to.equal(assets[assetNames[0]]);
        expect(assetOne).to.equal(assets[assetNames[1]]);
        done();
      });

      sinon.assert.calledWith(
        config.generateUrl,
        assetNames,
        config.namespaceName
      );

      sinon.assert.calledWith(
        loader.loadScript,
        config.generateUrl(assetNames, config.namespaceName),
        loaderOptions,
        sinon.match.func
      );

      // After both of these are done, the callback for require() should
      // trigger. Do them out of order for the sake of it.
      staticAssetLoader.define(
        assetNames[1],
        assets[assetNames[1]]
      );
      staticAssetLoader.define(
        assetNames[0],
        assets[assetNames[0]]
      );
    });

    it('if an asset exists, do not request it', function (done) {
      // Define the dependency first.
      staticAssetLoader.define(
        assetNames[0],
        assets[assetNames[0]]
      );

      staticAssetLoader.require(assetNames, function (dependencyOne, assetOne) {
        expect(dependencyOne).to.equal(assets[assetNames[0]]);
        expect(assetOne).to.equal(assets[assetNames[1]]);
        done();
      });

      sinon.assert.calledWith(
        config.generateUrl,
        assetNames.slice(1),
        config.namespaceName
      );

      sinon.assert.calledWith(
        loader.loadScript,
        config.generateUrl(assetNames.slice(1), config.namespaceName),
        loaderOptions,
        sinon.match.func
      );

      // After this is done, the callback for require() should
      // trigger.
      staticAssetLoader.define(
        assetNames[1],
        assets[assetNames[1]]
      );
    });

    it('require the same things twice, but only one load request', function (done) {
      var completed = 0;

      function finish (done) {
        completed++;
        if (completed === 2) {
          done();
        }
      }

      staticAssetLoader.require(assetNames, function (dependencyOne, assetOne) {
        expect(dependencyOne).to.equal(assets[assetNames[0]]);
        expect(assetOne).to.equal(assets[assetNames[1]]);
        finish(done);
      });
      staticAssetLoader.require(assetNames, function (dependencyOne, assetOne) {
        expect(dependencyOne).to.equal(assets[assetNames[0]]);
        expect(assetOne).to.equal(assets[assetNames[1]]);
        finish(done);
      });

      sinon.assert.calledOnce(config.generateUrl);
      sinon.assert.calledOnce(loader.loadScript);

      // After both of these are done, the callback for require() should
      // trigger. Do them out of order for the sake of it.
      staticAssetLoader.define(
        assetNames[1],
        assets[assetNames[1]]
      );
      staticAssetLoader.define(
        assetNames[0],
        assets[assetNames[0]]
      );
    });

    it('partial definition of requirements means no callback', function (done) {
      var complete = false;

      staticAssetLoader.require(assetNames, function (dependencyOne, assetOne) {
        complete = true;
      });

      staticAssetLoader.define(
        assetNames[1],
        assets[assetNames[1]]
      );

      setTimeout(function () {
        expect(complete).to.equal(false);
        done();
      }, 1000);
    });

    it('works with no callback', function (done) {
      staticAssetLoader.require(assetNames);

      staticAssetLoader.define(
        assetNames[1],
        assets[assetNames[1]]
      );
      staticAssetLoader.define(
        assetNames[0],
        assets[assetNames[0]]
      );

      staticAssetLoader.require(assetNames, function (dependencyOne, assetOne) {
        expect(dependencyOne).to.equal(assets[assetNames[0]]);
        expect(assetOne).to.equal(assets[assetNames[1]]);
        done();
      });
    });

    it('cannot redefine an asset', function (done) {
      var assetA = { a: 1 };
      var assetB = { b: 1 };

      staticAssetLoader.define(
        assetNames[0],
        assetA
      );
      staticAssetLoader.define(
        assetNames[0],
        assetB
      );

      staticAssetLoader.require([assetNames[0]], function (dependencyOne) {
        expect(dependencyOne).to.equal(assetA);
        done();
      });
    });
  });
});
