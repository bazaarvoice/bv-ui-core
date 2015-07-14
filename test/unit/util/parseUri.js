/**
 * @fileOverview Unit tests for the parseUri utility
 */
'use strict';

var tap = require('tap');
var parseUri = require('../../../lib/util/parseUri');

// Test a simple case
tap.test('Simple URL', function (t) {
  var url = 'http://www.example.com';
  var parsedUri = parseUri(url);

  t.plan(15);
  t.equal(parsedUri.anchor, '', 'No anchor found');
  t.equal(parsedUri.query, '', 'No query found');
  t.equal(parsedUri.file, '', 'No file found');
  t.equal(parsedUri.directory, '', 'No directory found');
  t.equal(parsedUri.path, '', 'No path found');
  t.equal(parsedUri.relative, '', 'No relative path found');
  t.equal(parsedUri.port, '', 'No port found');
  t.equal(parsedUri.host, 'www.example.com', 'Host is www.example.com');
  t.equal(parsedUri.password, '', 'No password found');
  t.equal(parsedUri.user, '', 'No user found');
  t.equal(parsedUri.userInfo, '', 'No userInfo found');
  t.equal(parsedUri.authority, 'www.example.com', 'Authority is www.example.com');
  t.equal(parsedUri.protocol, 'http', 'Protocol is http');
  t.equal(parsedUri.source, url, 'Source is original URL');
  t.same(parsedUri.queryKey, {}, 'Query key is empty');
});

// Test an elaborate case
tap.test('Complex URL', function (t) {
  var url = 'https://bob:smith@subdomain.example.com:8080/path/to/file.html?foo=bar&baz=3#hash';
  var parsedUri = parseUri(url);

  t.plan(15);
  t.equal(parsedUri.anchor, 'hash', 'Anchor is "hash"');
  t.equal(parsedUri.query, 'foo=bar&baz=3', 'Query is foo=bar&baz=3');
  t.equal(parsedUri.file, 'file.html', 'File is file.html');
  t.equal(parsedUri.directory, '/path/to/', 'Directory is /path/to');
  t.equal(parsedUri.path, '/path/to/file.html', 'Path is /path/to/file.html');
  t.equal(parsedUri.relative, '/path/to/file.html?foo=bar&baz=3#hash', 'Relative path is /path/to/file.html?foo=bar&baz=3#hash');
  t.equal(parsedUri.port, '8080', 'Port is 8080');
  t.equal(parsedUri.host, 'subdomain.example.com', 'Host is subdomain.example.com');
  t.equal(parsedUri.password, 'smith', 'Password is smith');
  t.equal(parsedUri.user, 'bob', 'User is bob');
  t.equal(parsedUri.userInfo, 'bob:smith', 'User is bob:smith');
  t.equal(parsedUri.authority, 'bob:smith@subdomain.example.com:8080', 'Authority is bob:smith@subdomain.example.com:8080');
  t.equal(parsedUri.protocol, 'https', 'Protocol is https');
  t.equal(parsedUri.source, url, 'Source is original URL');
  t.same(parsedUri.queryKey, { foo: 'bar', baz: '3' }, 'Query key is empty');
});
