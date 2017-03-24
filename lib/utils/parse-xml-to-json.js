var parseXML        = require('./parse-xml');
var _               = require('lodash');

module.exports = function parseXMLToJson(xmlPath) {
  return parseXML(xmlPath).then(function(rawXML) {
    var data = rawXML.widget;
    delete data.$.xmlns;
    delete data.$['xmlns:cdv'];
    var resultJSON = data.$;
    delete data.$;

    var result = parseObject(data);
    // _.forEach(data, function(nodes, key) {
    //   if (key === '$') {
    //
    //   }
    //   resultJSON[key] = nodes.map(function(value) {
    //     if (typeof value === 'string') {
    //       return value;
    //     }
    //   });
    // });

    return resultJSON;
  })
};

function parseObject(obj) {
  _.forEach(obj, function(value, key) {
    if (key === '$') {
      obj[key] = obj[key].$
      value = obj[key]
    }

    if (typeof value === 'string') {
      obj[key] = value;
    } else if (_.isArray(value)) {
      obj[key] = parseArray(value);
    } else if (typeof value === 'object') {
      obj[key] = parseObject(value);
    }
  });
  return obj;
}

function parseArray(array) {
  return array.map(function(value) {
    if (typeof value === 'string') {
      return value;
    } else if (_.isArray(value)) {
      return parseArray(value);
    } else if (typeof value === 'object') {
      return parseObject(value);
    }
  })
}
