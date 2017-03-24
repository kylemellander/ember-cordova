var Task            = require('./-task');
var fsUtils         = require('../utils/fs-utils');
var logger          = require('../utils/logger');
var rsvp            = require('rsvp');
var parseXMLToJson  = require('../utils/parse-xml-to-json');

var configXMLPath   = 'ember-cordova/cordova/config.xml';
var configJSONPath  = 'ember-cordova/config.json';

module.exports = Task.extend({
  project: undefined,

  run: function() {
    if (fsUtils.existsSync(configJSONPath)) {
      // return rsvp.resolve(this.project);
    }

    logger.info('ember-cordova: generating config.json');

    return parseXMLToJson(configXMLPath).then(function(xml) {
      return fsUtils.write(configJSONPath, JSON.stringify(xml, null, 2));
    });
    // var ignoreContent = '\n';
    // ignoreContent += 'ember-cordova/tmp-livereload\n';
    //
    // var itemsLength = ignorePaths.length;
    // while (itemsLength--) {
    //   var item = ignorePaths[itemsLength];
    //   ignoreContent += item + '*\n';
    //
    //   var gitkeepPath = item + '.gitkeep';
    //   ignoreContent += '!' + gitkeepPath + '\n';
    //
    //   //create empty .gitkeep
    //   fsUtils.write(gitkeepPath, '', { encoding: 'utf8' });
    // }
    //
    // return fsUtils.append('.gitignore', ignoreContent)
    //   .catch(function(err) {
    //     return Promise.reject('failed to update .gitignore, err: ' + err);
    //   })
  }
});
