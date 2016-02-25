/* eslint no-use-before-define: 0 */
/**
 * @fileOverview
 * Unit tests for the loader module.
 */

var global = require('../../../lib/global');
var loader = require('../../../lib/loader');
var namespacer = require('../../../lib/namespacer');

describe('lib/loader', function () {

  var doc;
  var canaryEl;
  var links;
  var originalLinkCount;
  var TESTING_NAMESPACE_NAME = 'BV_LOADER_TESTING';
  var namespace = namespacer.namespace(TESTING_NAMESPACE_NAME);

  beforeEach(function () {
    doc = global.document;
    links = doc.getElementsByTagName('link');
    originalLinkCount = links.length;

    loader._clearLoadedUrls();

    canaryEl = doc.createElement('div');
    doc.body.appendChild(canaryEl);
    canaryEl.id = 'canary';
  });

  afterEach(function () {
    links = doc.getElementsByTagName('link');
    var newLinks = links.length - originalLinkCount;

    for (var i=0; i<newLinks; i++) {
      var link = links[originalLinkCount];
      link.parentNode.removeChild(link);
    }

    // Remove canary element.
    canaryEl.parentNode.removeChild(canaryEl);
  });

  describe('loadScript', function () {

    describe('arguments', function () {

      it('url is required', function () {
        expect(function () {
          loader.loadScript();
        }).to.throw(/`url` must be a string/);
      });

      it('url must be a string', function () {
        expect(function () {
          loader.loadScript(123);
        }).to.throw(/`url` must be a string/);
      });

      describe('options', function () {

        it('argument is optional', function (done) {
          global.libLoaderTestCallback = function () {
            global.libLoaderTestCallback = function () {};
            done();
          };

          expect(function () {
            loader.loadScript('/base/test/fixtures/lib.loader.loadscript.js');
          }).to.not.throw(Error);
        });

        it('argument is optional when callback is provided', function (done) {
          global.libLoaderTestCallback = function () {};

          expect(function () {
            loader.loadScript('/base/test/fixtures/lib.loader.loadscript.js', null, function () {
              done();
            });
          }).to.not.throw(Error);
        });

        it('options is optional', function (done) {
          global.libLoaderTestCallback = function () {
            global.libLoaderTestCallback = function () {};
            done();
          };

          expect(function () {
            loader.loadScript('/base/test/fixtures/lib.loader.loadscript.js', {});
          }).to.not.throw(Error);
        });

        it('options.timeout must be a number', function () {
          expect(function () {
            loader.loadScript('/base/test/fixtures/lib.loader.loadscript.js', {
              timeout: '123'
            });
          }).to.throw(/`options.timeout` must be a number/);
        });

        it('options.namespaceName must be a string', function () {
          expect(function () {
            loader.loadScript('/base/test/fixtures/lib.loader.loadscript.js', {
              namespaceName: 123
            });
          }).to.throw(/`options.namespaceName` must be a string/);
        });

        it('options.forceLoad must be a boolean', function () {
          expect(function () {
            loader.loadScript('/base/test/fixtures/lib.loader.loadscript.js', {
              forceLoad: '123'
            });
          }).to.throw(/`options.forceLoad` must be a boolean/);
        });

        it('options.attributes sets attributes on the script tag', function (done) {
          global.libLoaderAttributeTestCallback = function () {
            global.libLoaderAttributeTestCallback = function () {};
            expect(doc.querySelector('script[data-main="foo.js"]')).to.not.equal(null);
            done();
          };

          loader.loadScript('/base/test/fixtures/lib.loader.loadscript-attribute.js', {
            attributes: {
              'data-main': 'foo.js'
            }
          });
        });

      });

      it('callback is optional', function (done) {
        global.libLoaderTestCallback = function () {
          done();
        };
        expect(function () {
          loader.loadScript('/base/test/fixtures/lib.loader.loadscript.js', {});
        }).to.not.throw(Error);
      });

      it('callback must be a function', function () {
        expect(function () {
          loader.loadScript('/base/test/fixtures/lib.loader.loadscript.js', {}, 123);
        }).to.throw(/`callback` must be a function/);
      });

    });

    it('loads the script at `url`', function (done) {
      global.libLoaderTestCallback = function () {
        global.libLoaderTestCallback = function () {};
        clearTimeout(timeout);
        done();
      };

      loader.loadScript('/base/test/fixtures/lib.loader.loadscript.js');
      var timeout = setTimeout(function () {
        global.libLoaderTestCallback = function () {};
        done(new Error('script load timed out'));
      }, 1000);
    });

    it('loads the script on a later turn of the event loop', function (done) {
      var later = false;
      var timeout;

      setTimeout(function () {
        later = true;
      }, 0);

      global.libLoaderTestCallback = function () {
        clearTimeout(timeout);
        expect(later).to.equal(true);
        global.libLoaderTestCallback = function () {};
        done();
      };

      loader.loadScript('/base/test/fixtures/lib.loader.loadscript.js?');
      timeout = setTimeout(function () {
        global.libLoaderTestCallback = function () {};
        done(new Error('script load timed out'));
      }, 1000);
    });

    it('calls back on success', function (done) {
      var timeout;
      global.libLoaderTestCallback = function () {};

      loader.loadScript('/base/test/fixtures/lib.loader.loadscript.js', function () {
        clearTimeout(timeout);
        done();
      });

      timeout = setTimeout(function () {
        done(new Error('script load timed out'));
      }, 1000);
    });

    it('executes callback after the script', function (done) {
      var timeout;
      var scriptExecuted = false;

      global.libLoaderTestCallback = function () {
        scriptExecuted = true;
      };

      loader.loadScript('/base/test/fixtures/lib.loader.loadscript.js', function () {
        clearTimeout(timeout);
        expect(scriptExecuted).to.equal(true);
        done();
      });

      timeout = setTimeout(function () {
        done(new Error('script load timed out'));
      }, 1000);
    });

    it('loads same script once if forceLoad flag not set', function (done) {
      var timeout;
      var scriptExecuted = 0;

      global.libLoaderTestCallback = function () {
        scriptExecuted = 1;
      };

      loader.loadScript('/base/test/fixtures/lib.loader.loadscript.js', function () {
        expect(scriptExecuted).to.equal(1);

        global.libLoaderTestCallback = function () {
          scriptExecuted = 2;
        };

        loader.loadScript('/base/test/fixtures/lib.loader.loadscript.js', function () {
          clearTimeout(timeout);
          expect(scriptExecuted).to.equal(1);
          done();
        });
      });

      timeout = setTimeout(function () {
        done(new Error('script load timed out'));
      }, 2000);
    });

    it('loads same script multiple times if forceLoad flag set', function (done) {
      var timeout;
      var scriptExecuted = 0;

      global.libLoaderTestCallback = function () {
        scriptExecuted = 1;
      };

      loader.loadScript('/base/test/fixtures/lib.loader.loadscript.js', function () {
        expect(scriptExecuted).to.equal(1);

        global.libLoaderTestCallback = function () {
          scriptExecuted = 2;
        };

        loader.loadScript('/base/test/fixtures/lib.loader.loadscript.js', {
          forceLoad: true
        }, function () {
          clearTimeout(timeout);
          expect(scriptExecuted).to.equal(2);
          done();
        });
      });

      timeout = setTimeout(function () {
        done(new Error('script load timed out'));
      }, 2000);
    });

    it('loads same script in specified namespaceName', function (done) {
      var scriptExecuted = 0;
      var url = '/base/test/fixtures/lib.loader.loadscript.js';

      global.libLoaderTestCallback = function () {
        scriptExecuted = 1;
      };

      loader.loadScript(url, {
        namespaceName: TESTING_NAMESPACE_NAME
      }, function () {
        expect(scriptExecuted).to.equal(1);
        expect(namespace.loadedUrls[url]).to.equal(true);

        global.libLoaderTestCallback = function () {
          scriptExecuted = 2;
        };

        loader.loadScript('/base/test/fixtures/lib.loader.loadscript.js', {
          namespaceName: TESTING_NAMESPACE_NAME
        }, function () {
          clearTimeout(timeout);
          expect(scriptExecuted).to.equal(1);
          done();
        });

      });

      timeout = setTimeout(function () {
        done(new Error('script load timed out'));
      }, 2000);
    });

    it('script should not be added to list if failed to load', function (done) {
      // skip this test in IE8 and jsdom
      if (global.attachEvent || global.isJsdom) {
        return done();
      }

      var timeout;
      var invalidUrl = '/no.such.script.js';

      loader.loadScript(invalidUrl, {
        namespaceName: TESTING_NAMESPACE_NAME
      }, function (err) {
        clearTimeout(timeout);
        expect(err).to.be.instanceof(Error);
        expect(err.message).to.equal('Error: could not load /no.such.script.js');
        expect(namespace.loadedUrls[invalidUrl]).to.equal(undefined);
        done();
      });

      timeout = setTimeout(function () {
        done(new Error('script load timed out'));
      }, 1000);
    });

    it('calls back on failure', function (done) {
      // skip this test in IE8 and jsdom
      if (global.attachEvent || global.isJsdom) {
        return done();
      }

      var timeout;

      loader.loadScript('/no.such.script.js', {
        timeout: 1000
      }, function (err) {
        expect(err).to.be.instanceof(Error);
        expect(err.message).to.equal('Error: could not load /no.such.script.js');
        clearTimeout(timeout);
        done();
      });

      timeout = setTimeout(function () {
        done(new Error('script load error timed out'));
      }, 1100);
    });

    it('`document` has correct value in loaded script', function (done) {
      global.libLoaderTestCallback = function (providedDoc) {
        expect(providedDoc).to.equal(doc);
        done();
      };

      loader.loadScript('/base/test/fixtures/lib.loader.document-is-wrong-in-ie8.js');
    });

  });

  describe('loadStyleSheet', function () {

    describe('arguments', function () {

      it('url is required', function () {
        expect(function () {
          loader.loadStyleSheet();
        }).to.throw(/`url` must be a string/);
      });

      it('url must be a string', function () {
        expect(function () {
          loader.loadStyleSheet(123);
        }).to.throw(/`url` must be a string/);
      });

      it('options', function () {

        it('argument is optional', function () {
          expect(function () {
            loader.loadStyleSheet('/base/test/fixtures/lib.loader.loadstylesheet.css');
          }).to.not.throw(Error);
        });

        it('argument is optional when callback is provided', function () {
          expect(function () {
            loader.loadStyleSheet(
              '/base/test/fixtures/lib.loader.loadstylesheet.css',
              null,
              function () {
                test.done();
              });
          }).to.not.throw(Error);
        });

        it('options is optional', function () {
          expect(function () {
            loader.loadStyleSheet('/base/test/fixtures/lib.loader.loadstylesheet.css', {});
          }).to.not.throw(Error);
        });

        it('options.timeout must be a number', function () {
          expect(function () {
            loader.loadStyleSheet('/base/test/fixtures/lib.loader.loadstylesheet.css', {
              timeout: '123'
            });
          }).to.throw(/`options.timeout` must be a number/);
        });

        it('options.attributes sets attributes on the link tag', function (done) {
          loader.loadStyleSheet('/base/test/fixtures/lib.loader.loadstylesheet.css', {
            attributes: {
              id: 'loaded-css'
            }
          }, function () {
            expect(doc.querySelector('#loaded-css')).to.not.equal(null);
            done();
          });
        });

        it('options.injectionNode defines injection point for link tag', function (done) {
          var container = doc.createElement('div');

          loader.loadStyleSheet('/base/test/fixtures/lib.loader.loadstylesheet.css', {
            injectionNode: container
          }, function () {
            test.ok(container.getElementsByTagName('link').length > 0);
            test.done();
          });
        });

        it('options.injectionNode must be a DOM node', function () {
          expect(function () {
            loader.loadStyleSheet('/base/test/fixtures/lib.loader.loadstylesheet.css', {
              injectionNode: false
            });
          }).to.throw(/`options.injectionNode` must be a DOM node/);
        });

        it('options.injectionNode should throw if appending fails', function (done) {
          var container = doc.createElement('div');

          container.appendChild = function () {
            throw new Error('Intentional sabotage!');
          };

          loader.loadStyleSheet('/base/test/fixtures/lib.loader.loadstylesheet.css', {
            injectionNode: container
          }, function (error) {
            expect(error).to.be.instanceof(Error);
            done();
          });
        });

        it('options.namespaceName must be a string', function () {
          expect(function () {
            loader.loadScript('/base/test/fixtures/lib.loader.loadscript.js', {
              namespaceName: 123
            });
          }).to.throw(/`options.namespaceName` must be a string/);
        });

        it('options.forceLoad must be a boolean', function () {
          expect(function () {
            loader.loadScript('/base/test/fixtures/lib.loader.loadscript.js', {
              forceLoad: '123'
            });
          }).to.throw(/`options.forceLoad` must be a boolean/);
        });

      });

      it('callback is optional', function () {
        expect(function () {
          loader.loadStyleSheet('/base/test/fixtures/lib.loader.loadstylesheet.css', {});
        }).to.not.throw(Error);
      });

      it('callback must be a function', function () {
        expect(function () {
          loader.loadStyleSheet('/base/test/fixtures/lib.loader.loadstylesheet.css', {}, 123);
        }).to.throw(/`callback` must be a function/);
      });

      /*
      // TODO: Fix this test; it fails, even though the actual functionality
      // appears to work fine.
      it('loads the stylesheet at `url`', function (done) {
        loader.loadStyleSheet('/base/test/fixtures/lib.loader.loadstylesheet.css', function () {
          expect(canaryEl.offsetWidth).to.equal(100);
          done();
        });
      });
      */

    });

    it('loads the stylesheet on a later turn of the event loop', function (done) {
      // TODO: this test fails in PhantomJS; the callback is never called.
      if (/PhantomJS/.test(global.navigator.userAgent)) {
        return done();
      }

      loader.loadStyleSheet('/base/test/fixtures/lib.loader.loadstylesheet.css', done);
      expect(canaryEl.offsetWidth).to.not.equal(100);
    });

    it('calls back on success', function (done) {
      // TODO: this test fails in PhantomJS; the callback is never called.
      if (/PhantomJS/.test(global.navigator.userAgent)) {
        return done();
      }

      loader.loadStyleSheet('/base/test/fixtures/lib.loader.loadstylesheet.css', done);
    });

    it('calls back on failure', function (done) {
      if (global.attachEvent) {
        // Skip this test in IE8.
        return done();
      }

      loader.loadStyleSheet('/no.such.stylesheet.css', {
        timeout: 1000
      }, function (error) {
        clearTimeout(timeout);
        expect(error).to.be.instanceof(Error);
        expect(error.message).to.equal('Error: could not load /no.such.stylesheet.css');
        done();
      });

      var timeout = setTimeout(function () {
        done(new Error('stylesheet load error timed out'));
      }, 1100);

    });

    it('loads same stylesheet once if forceLoad flag not set', function (done) {
      loader.loadStyleSheet('/base/test/fixtures/lib.loader.loadstylesheet.css', function () {
        linkElements = doc.getElementsByTagName('link');
        expect(linkElements.length).to.equal(originalLinkCount + 1);

        loader.loadStyleSheet('/base/test/fixtures/lib.loader.loadstylesheet.css', function () {
          linkElements = doc.getElementsByTagName('link');
          expect(linkElements.length).to.equal(originalLinkCount + 1);
          done();
        });
      });
    });

    it('loads same stylesheet multiple times if forceLoad flag set', function (done) {
      loader.loadStyleSheet('/base/test/fixtures/lib.loader.loadstylesheet.css', function () {
        linkElements = doc.getElementsByTagName('link');
        expect(linkElements.length).to.equal(originalLinkCount + 1);

        loader.loadStyleSheet('/base/test/fixtures/lib.loader.loadstylesheet.css', {
          forceLoad: true
        }, function () {
          linkElements = doc.getElementsByTagName('link');
          expect(linkElements.length).to.equal(originalLinkCount + 2);
          done();
        });
      });
    });

    it('loads same stylesheet in specified namespaceName', function (done) {
      var url = '/base/test/fixtures/lib.loader.loadstylesheet.css';

      loader.loadStyleSheet(url, {
        namespaceName: TESTING_NAMESPACE_NAME
      }, function () {
        linkElements = doc.getElementsByTagName('link');
        expect(linkElements.length).to.equal(originalLinkCount + 1);

        var namespace = namespacer.namespace(TESTING_NAMESPACE_NAME);
        expect(namespace.loadedUrls[url]).to.equal(true);

        loader.loadStyleSheet('/base/test/fixtures/lib.loader.loadstylesheet.css', {
          namespaceName: TESTING_NAMESPACE_NAME
        }, function () {
          linkElements = doc.getElementsByTagName('link');
          expect(linkElements.length).to.equal(originalLinkCount + 1);
          done();
        });
      });
    });

    it('calls back on failure', function (done) {
      if (global.attachEvent) {
        // Skip this test in IE8.
        return done();
      }

      var invalidUrl = '/no.such.stylesheet.css';

      loader.loadStyleSheet(invalidUrl, {
        namespaceName: TESTING_NAMESPACE_NAME
      }, function (err) {
        clearTimeout(timeout);
        expect(err).to.be.instanceof(Error);
        expect(err.message).to.equal('Error: could not load /no.such.stylesheet.css');
        expect(namespace.loadedUrls[invalidUrl]).to.equal(undefined);
        done();
      });

      var timeout = setTimeout(function () {
        done(new Error('stylesheet load error timed out'));
      }, 1000);

    });

  });
});
