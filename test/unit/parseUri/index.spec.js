/**
 * @fileOverview
 * Unit tests for the parseUri utility.
 */

// Imports.
var parseUri = require('../../../lib/parseUri');

describe('lib/parseUri', function () {

  it('correctly parses a simple URL', function () {
    var url = 'http://www.example.com';
    var parsedUri = parseUri(url);

    expect(parsedUri.anchor).to.equal('');
    expect(parsedUri.query).to.equal('');
    expect(parsedUri.file).to.equal('');
    expect(parsedUri.directory).to.equal('');
    expect(parsedUri.path).to.equal('');
    expect(parsedUri.relative).to.equal('');
    expect(parsedUri.port).to.equal('');
    expect(parsedUri.host).to.equal('www.example.com');
    expect(parsedUri.password).to.equal('');
    expect(parsedUri.user).to.equal('');
    expect(parsedUri.userInfo).to.equal('');
    expect(parsedUri.authority).to.equal('www.example.com');
    expect(parsedUri.protocol).to.equal('http');
    expect(parsedUri.source).to.equal(url);
    expect(parsedUri.queryKey).to.eql({});
  });

  it('correctly parses a complex URL', function () {
    var url = 'https://bob:smith@subdomain.example.com:8080/path/to/file.html?foo=bar&baz=3#hash';
    var parsedUri = parseUri(url);

    expect(parsedUri.anchor).to.equal('hash');
    expect(parsedUri.query).to.equal('foo=bar&baz=3');
    expect(parsedUri.file).to.equal('file.html');
    expect(parsedUri.directory).to.equal('/path/to/');
    expect(parsedUri.path).to.equal('/path/to/file.html');
    expect(parsedUri.relative).to.equal('/path/to/file.html?foo=bar&baz=3#hash');
    expect(parsedUri.port).to.equal('8080');
    expect(parsedUri.host).to.equal('subdomain.example.com');
    expect(parsedUri.password).to.equal('smith');
    expect(parsedUri.user).to.equal('bob');
    expect(parsedUri.userInfo).to.equal('bob:smith');
    expect(parsedUri.authority).to.equal('bob:smith@subdomain.example.com:8080');
    expect(parsedUri.protocol).to.equal('https');
    expect(parsedUri.source).to.equal(url);
    expect(parsedUri.queryKey).to.eql({ foo: 'bar', baz: '3' });
  });

  it('correctly parses a URL with the @ symbol in the query', function () {
    var url = 'https://dev04-webstore-jackwills.demandware.net/on/demandware.store/Sites-jwuk-Site/en_GB/DebugPipelines-ShowConfirmation?cid=p@p.com&&oid=00026203';
    var parsedUri = parseUri(url);

    expect(parsedUri.anchor).to.equal('');
    expect(parsedUri.query).to.equal('cid=p@p.com&&oid=00026203');
    expect(parsedUri.file).to.equal('');
    expect(parsedUri.directory).to.equal('/on/demandware.store/Sites-jwuk-Site/en_GB/DebugPipelines-ShowConfirmation');
    expect(parsedUri.path).to.equal('/on/demandware.store/Sites-jwuk-Site/en_GB/DebugPipelines-ShowConfirmation');
    expect(parsedUri.relative).to.equal('/on/demandware.store/Sites-jwuk-Site/en_GB/DebugPipelines-ShowConfirmation?cid=p@p.com&&oid=00026203');
    expect(parsedUri.port).to.equal('');
    expect(parsedUri.host).to.equal('dev04-webstore-jackwills.demandware.net');
    expect(parsedUri.password).to.equal('');
    expect(parsedUri.user).to.equal('');
    expect(parsedUri.userInfo).to.equal('');
    expect(parsedUri.authority).to.equal('dev04-webstore-jackwills.demandware.net');
    expect(parsedUri.protocol).to.equal('https');
    expect(parsedUri.source).to.equal(url);
    expect(parsedUri.queryKey).to.eql({ cid: 'p@p.com', oid: '00026203' });
  })

});
