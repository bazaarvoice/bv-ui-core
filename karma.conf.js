/**
 * @fileOverview
 * Karma configuration.
 */

module.exports = function (config) {
  config.set({

    plugins: [
      require('karma-mocha'),
      require('karma-chai'),
      require('karma-sinon-chai'),
      require('karma-webpack'),
      require('karma-chrome-launcher'),
      require('karma-phantomjs-launcher'),
      require('karma-coverage')
    ],

    // Base path that will be used to resolve all patterns (eg. files, exclude).
    basePath: '',

    // Frameworks to use.
    // See: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon-chai'],

    client: {
      mocha: {
        // Change Karma's debug.html to the mocha web reporter.
        reporter: 'html',
        ui: 'bdd'
      }
    },

    // list of files / patterns to load in the browser.
    files: [
      // Loaded into the browser test page.
      'test/unit/mochaInit.js',
      'test/unit/**/*.spec.js',

      // Made available but not loaded. Note that the path for loading these
      // files is prefixed with 'base/'.
      {
        pattern: 'test/fixtures/**',
        included: false,
        served: true,
        watched: true,
        nocache: true
      }
    ],

    // List of files to exclude.
    exclude: [],

    // Preprocess matching files before serving them to the browser.
    // See: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/**/*.js': ['webpack']
    },

    coverageReporter: {
      type: 'text',
      dir: 'coverage/'
    },

    webpack: {
      node: {
        fs: 'empty'
      },
      // https://github.com/deepsweet/istanbul-instrumenter-loader allows
      // code coverage of just the things we want.
      module: {
        postLoaders: [{
          test: /\.js$/,
          exclude: /(test|node_modules)\//,
          loader: 'istanbul-instrumenter'
        }]
      }
    },

    webpackMiddleware: {
      noInfo: true
    },

    // Test results reporter to use. Possible values: 'dots', 'progress'.
    // See: https://npmjs.org/browse/keyword/karma-reporter
    reporters: [
      'dots',
      'coverage'
    ],

    // Web server port.
    port: 9876,

    // Enable / disable colors in the output (reporters and logs).
    colors: true,

    // Level of logging.
    //
    // possible values:
    //   config.LOG_DISABLE
    //   config.LOG_ERROR
    //   config.LOG_WARN
    //   config.LOG_INFO
    //   config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Enable / disable watching file and executing tests whenever any file
    // changes.
    autoWatch: true,

    // Start these browsers.
    // See: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    // Continuous Integration mode. If true, Karma captures browsers, runs the
    // tests and exits.
    singleRun: false
  });
};
