import Application from '@ember/application';

import config from 'dummy/config/environment';
import { initialize } from 'dummy/initializers/setup-router-service-refresh-polyfill';
import { module } from 'qunit';
import Resolver from 'ember-resolver';
import { run } from '@ember/runloop';
import { testIfPolyfilled } from '../../helpers/should-test-polyfill';

module(
  'Unit | Initializer | setup-router-service-refresh-polyfill',
  function (hooks) {
    hooks.beforeEach(function () {
      this.TestApplication = class TestApplication extends Application {
        modulePrefix = config.modulePrefix;
      };
      this.TestApplication.initializer({
        name: 'initializer under test',
        initialize,
      });

      this.application = this.TestApplication.create({
        autoboot: false,
        Resolver,
      });
    });

    hooks.afterEach(function () {
      run(this.application, 'destroy');
    });

    testIfPolyfilled(
      'it adds the polyfilled refresh method to the RouterService',
      async function (assert) {
        await this.application.boot();
        const applicationInstance = this.application.buildInstance();
        const routerService = applicationInstance.lookup('service:router');

        assert.strictEqual(typeof routerService.refresh, 'function');
      }
    );
  }
);
