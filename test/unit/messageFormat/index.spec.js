/**
 * @fileOverview
 * Unit tests for the messageFormat module 
 */
var messageFormat = require('../../../lib/messageFormat');

describe('lib/messageFormat', function () {
  it('messageFormat.generateCountryFromLocale', function () {
    function test1 () {  
      return  messageFormat.generateCountryFromLocale('en_US');
    }

    expect(test1()).to.be.equal('United States');

    function test2 () {
      return messageFormat.generateCountryFromLocale('en_DE');
    }

    expect(test2()).to.be.equal('Germany')

    function test3 () {
      return messageFormat.generateCountryFromLocale('de_DE');
    }
    expect(test3()).to.be.equal('Deutschland')

    function test4 () {
      return messageFormat.generateCountryFromLocale()
    }
    expect(test4()).to.be.empty
  });
});
