/**
 * @fileOverview
 * Karma configuration.
 */

module.exports = function (config) {
  config.set({

    plugins: [
      require('karma-mocha'),
      require('karma-chai'),
      require('karma-webpack'),
      require('karma-chrome-launcher'),
      require('karma-phantomjs-launcher'),
      require('karma-coverage')
    ],

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],

    client: {
      mocha: {
        // Change Karma's debug.html to the mocha web reporter.
        reporter: 'html',
        ui: 'bdd'
      }
    },

    // list of files / patterns to load in the browser
    files: [
      'test/unit/mochaInit.js',
      'test/unit/**/*.spec.js'
    ],

    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
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
      // code coverage of just the things we want
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

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: [
      'dots',
      'coverage'
    ],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
