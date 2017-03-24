'use strict';

var td              = require('testdouble');
var mockProject     = require('../../fixtures/ember-cordova-mock/project');
var fsUtils         = require('../../../lib/utils/fs-utils');
var Promise         = require('rsvp');

var expect          = require('../../helpers/expect');

describe('create config.json', function() {

  var createTask = function() {
    var CreateConfigJSON = require('../../../lib/tasks/create-config-json');
    return new CreateConfigJSON({
      project: mockProject.project
    });
  };

  afterEach(function() {
    td.reset();
  });

  it('parses xml file and writes it to config.json', function() {
    var writePath, writeContent = undefined;
    td.replace(fsUtils, 'existsSync', function() {
      return false;
    });
    td.replace(fsUtils, 'write', function(path, content) {
      writePath = path;
      writeContent = content;
      return Promise.resolve();
    })

    var task = createTask();

    return task.run().then(function() {
      expect(writeContent).to.equal('');
      expect(writePath).to.equal('/ember-cordova/config.json');
    });
  });
});
