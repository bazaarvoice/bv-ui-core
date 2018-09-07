/**
 * @fileOverview Simple utility for parsing URIs.
 * Originally from http://blog.stevenlevithan.com/archives/parseuri
 * and from Firebird's util directory.
 */

function parseUri (str) {
  var o = parseUri.options;
  var m = o.parser[o.strictMode ? 'strict' : 'loose'].exec(str);
  var uri = {};
  var i = 14;

  while (i--) {
    uri[o.key[i]] = m[i] || '';
  }

  uri[o.q.name] = {};
  uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
    if ($1) {
      uri[o.q.name][$1] = $2;
    }
  });

  return uri;
}

parseUri.options = {
  strictMode: false,
  key: ['source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'],
  q: {
    name: 'queryKey',
    parser: /(?:^|&)([^&=]*)=?([^&]*)/g
  },
  // Both of these parser regexes have been edited from the original linked above.
  // A / character has been added to the excluded characters in the 4th and 5th
  // capture groups to fix a bug where it would see a @ character in a query
  // and consume it like it was delimiting a userInfo section.
  parser: {
    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:\/@]*)(?::([^\/:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
    loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^\/:@]*)(?::([^:\/@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
  }
};

module.exports = parseUri;
