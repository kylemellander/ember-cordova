const td             = require('testdouble');
const expect         = require('../../../helpers/expect');
const mockProject    = require('../../../fixtures/corber-mock/project');
const WatchmanCfg    = require('../../../../lib/frameworks/ember/tasks/update-watchman-config');
const Promise        = require('rsvp').Promise;

const initFramework = function() {
  let Ember = require('../../../../lib/frameworks/ember/framework');
  return new Ember({
    project:mockProject.project,
    root: mockProject.project.root
  })
};

describe('Ember Framework', function() {
  afterEach(function() {
    td.reset();
  });

  it('has required props', function() {
    let framework = initFramework();

    expect(framework.name).to.equal('ember');
    expect(framework.buildCommand).to.equal('ember build');
    expect(framework.serveCommand).to.equal('ember serve');
    expect(framework.buildPath).to.equal('./dist');
    expect(framework.port).to.equal(4200);
  });

  it('build initializes a new BuildTask', function() {
    let BuildTask = td.replace('../../../../lib/tasks/bash-build');
    let buildDouble = td.replace(BuildTask.prototype, 'run');
    let framework = initFramework();

    framework.build({cordovaOutputPath: 'fakePath'});
    td.verify(new BuildTask({
      cordovaOutputPath: 'fakePath',
      buildCommand: 'ember build',
      buildPath: './dist'
    }));

    td.verify(buildDouble());
  });

  it('serve intializes a new ServeTask', function() {
    let ServeTask = td.replace('../../../../lib/tasks/bash-serve');
    let serveDouble = td.replace(ServeTask.prototype, 'run');
    let framework = initFramework();

    framework.serve({platform: 'ios'});
    td.verify(new ServeTask({
      command: framework.serveCommand,
      platform: 'ios'
    }));

    td.verify(serveDouble());
  });

  it('validateBuild calls _buildValidators then runs validators', function() {
    let runValidatorDouble = td.replace('../../../../lib/utils/run-validators');
    let framework = initFramework();

    td.replace(framework, '_buildValidators', function() {
      return ['validations'];
    });

    framework.validateBuild({});
    td.verify(runValidatorDouble(['validations']));
  });

  it('validateServe calls _buildValidators then runs validators', function() {
    let runValidatorDouble = td.replace('../../../../lib/utils/run-validators');
    let framework = initFramework();

    td.replace(framework, '_buildValidators', function() {
      return ['validations'];
    });

    framework.validateServe({});
    td.verify(runValidatorDouble(['validations']));
  });

  context('buildValidators', function() {
    it('inits validations', function() {
      let ValidateBrowserTargets = td.replace('../../../../lib/frameworks/ember/validators/browser-targets');
      let ValidateLocation = td.replace('../../../../lib/frameworks/ember/validators/location-type');
      let ValidateRoot = td.replace('../../../../lib/validators/root-url');
      let ValidateCorberEmber = td.replace('../../../../lib/frameworks/ember/validators/corber-ember');

      let framework = initFramework();
      let validators = framework._buildValidators({});

      td.verify(new ValidateBrowserTargets({
        config: mockProject.project.config(),
        root: mockProject.project.root
      }));

      td.verify(new ValidateLocation({
        config: mockProject.project.config(),
        force: undefined
      }));

      td.verify(new ValidateRoot({
        config: mockProject.project.config(),
        rootProps: ['baseURL', 'rootURL', 'baseUrl', 'rootUrl'],
        path: 'config/environment.js',
        force: undefined
      }));

      td.verify(new ValidateCorberEmber({
        root: mockProject.project.root
      }));

      expect(validators.length).to.equal(4);
    });

    it('passes the force flag to ValidateRootURL', function() {
      let ValidateRoot = td.replace('../../../../lib/validators/root-url');
      let framework = initFramework();

      framework._buildValidators({force: true});

      td.verify(new ValidateRoot({
        config: mockProject.project.config(),
        rootProps: ['baseURL', 'rootURL', 'baseUrl', 'rootUrl'],
        path: 'config/environment.js',
        force: true
      }));
    });

    it('skips non-glimmer validations if isGlimmer === true', function() {
      let framework = initFramework();
      framework.isGlimmer = true;

      let validators = framework._buildValidators({});

      expect(validators.length).to.equal(0);
    });
  });


  it('afterInstall runs UpdateWatchman task', function() {
    let tasks = [];

    td.replace(WatchmanCfg.prototype, 'run', function() {
      tasks.push('update-watchman-config');
      return Promise.resolve();
    });

    let framework = initFramework();

    return framework.afterInstall().then(function() {
      expect(tasks).to.deep.equal([
        'update-watchman-config'
      ]);
    });
  });
});
