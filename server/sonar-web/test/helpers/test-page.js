define(function (require) {

  var assert = require('intern/chai!assert');
  var fs = require('intern/dojo/node!fs');
  var Command = require('intern/dojo/node!leadfoot/Command');
  var pollUntil = require('intern/dojo/node!leadfoot/helpers/pollUntil');
  var _ = require('intern/dojo/node!underscore');

  var DEFAULT_TIMEOUT = 4000;

  Command.prototype.checkElementCount = function (selector, count) {
    return new this.constructor(this, function () {
      return this.parent
          .then(pollUntil(function (selector, count) {
            var elements = document.querySelectorAll(selector);
            return elements.length === count ? true : null;
          }, [selector, count], DEFAULT_TIMEOUT))
          .then(function () {

          }, function () {
            assert.fail(null, null, 'failed to find ' + count + ' elements by selector "' + selector + '"');
          });
    });
  };

  Command.prototype.checkElementExist = function (selector) {
    return new this.constructor(this, function () {
      return this.parent
          .then(pollUntil(function (selector) {
            var elements = document.querySelectorAll(selector);
            return elements.length > 0 ? true : null;
          }, [selector], DEFAULT_TIMEOUT))
          .then(function () {

          }, function () {
            assert.fail(null, null, 'failed to find elements by selector "' + selector + '"');
          });
    });
  };

  Command.prototype.checkElementNotExist = function (selector) {
    return new this.constructor(this, function () {
      return this.parent
          .then(pollUntil(function (selector) {
            var elements = document.querySelectorAll(selector);
            return elements.length === 0 ? true : null;
          }, [selector], DEFAULT_TIMEOUT))
          .then(function () {

          }, function () {
            assert.fail(null, null, 'failed to fail to find elements by selector "' + selector + '"');
          });
    });
  };

  Command.prototype.checkElementInclude = function (selector, text) {
    return new this.constructor(this, function () {
      return this.parent
          .then(pollUntil(function (selector, text) {
            var elements = Array.prototype.slice.call(document.querySelectorAll(selector));
            var result = elements.some(function (element) {
              return element.textContent.indexOf(text) !== -1;
            });
            return result ? true : null;
          }, [selector, text], DEFAULT_TIMEOUT))
          .then(function () {

          }, function () {
            assert.fail(null, null, 'failed to find elements by selector "' + selector +
                '" that include "' + text + '"');
          });
    });
  };

  Command.prototype.checkElementNotInclude = function (selector, text) {
    return new this.constructor(this, function () {
      return this.parent
          .then(pollUntil(function (selector, text) {
            var elements = Array.prototype.slice.call(document.querySelectorAll(selector));
            var result = elements.every(function (element) {
              return element.textContent.indexOf(text) === -1;
            });
            return result ? true : null;
          }, [selector, text], DEFAULT_TIMEOUT))
          .then(function () {

          }, function () {
            assert.fail(null, null, 'failed to fail to find elements by selector "' + selector +
                '" that include "' + text + '"');
          });
    });
  };

  Command.prototype.clickElement = function (selector) {
    return new this.constructor(this, function () {
      return this.parent
          .findByCssSelector(selector)
          .click()
          .end()
          .sleep(250);
    });
  };

  Command.prototype.fillElement = function (selector, value) {
    return new this.constructor(this, function () {
      return this.parent
          .execute(function (selector, value) {
            jQuery(selector).val(value);
          }, [selector, value]);
    });
  };

  Command.prototype.submitForm = function (selector) {
    return new this.constructor(this, function () {
      return this.parent
          .execute(function (selector) {
            jQuery(selector).submit();
          }, [selector]);
    });
  };

  /**
   * Mock a WS call
   * @param options
   * @param options.url URL to mock
   * @param options.file File that contains response
   * @param options.responseText Text to respond with
   * @returns {Command}
   */
  Command.prototype.mock = function (options) {

    /**
     * Try to read a file
     * @param {string|undefined} file
     * @returns {string|null}
     */
    function fromFile (file) {
      return file ? fs.readFileSync('src/test/json/' + file, 'utf-8') : null;
    }

    // first, try to read from file
    // then try to use provided responseText
    // finally fallback to "{}"
    options.responseText = fromFile(options.file) || options.responseText || '{}';

    // do not pass internal file parameter to mockjax
    delete options.file;

    return new this.constructor(this, function () {
      return this.parent
          .execute(function (options) {
            return jQuery.mockjax(options);
          }, [options]);
    });
  };

  /**
   * Clear all mocks
   * @returns {Command}
   */
  Command.prototype.clearMocks = function () {
    return new this.constructor(this, function () {
      return this.parent
          .execute(function () {
            jQuery.mockjax.clear();
          });
    });
  };

  Command.prototype.startApp = function (app, options) {
    return new this.constructor(this, function () {
      return this.parent
          .execute(function (app, options) {
            require(['apps/' + app + '/app'], function (App) {
              App.start(_.extend({ el: '#content' }, options));
            });
          }, [app, options])
          .sleep(1000);
    });
  };

  Command.prototype.open = function (hash) {
    var url = 'test/medium/base.html?' + Date.now();
    if (hash) {
      url += hash;
    }
    return new this.constructor(this, function () {
      return this.parent
          .get(require.toUrl(url))
          .mock({ url: '/api/l10n/index' })
          .checkElementExist('#content');
    });
  };

  Command.prototype.forceJSON = function () {
    return new this.constructor(this, function () {
      return this.parent
          .execute(function () {
            jQuery.ajaxSetup({ dataType: 'json' });
          });
    });
  };

});
