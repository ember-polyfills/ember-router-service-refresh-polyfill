/* eslint-disable ember/no-classic-classes */

import Route from '@ember/routing/route';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Acceptance | RouterService | refresh', function (hooks) {
  setupApplicationTest(hooks);

  test('it can be used to re-run the model hooks of active routes', async function (assert) {
    const routerService = this.owner.lookup('service:router');

    let parentCounter = 0;
    this.owner.register(
      'route:parent',
      Route.extend({
        model() {
          ++parentCounter;
        },
      })
    );

    let childCounter = 0;
    this.owner.register(
      'route:parent.child',
      Route.extend({
        model() {
          ++childCounter;
        },
      })
    );

    let sisterCounter = 0;
    this.owner.register(
      'route:parent.sister',
      Route.extend({
        model() {
          ++sisterCounter;
        },
      })
    );

    await visit('/');
    assert.equal(parentCounter, 1);
    assert.equal(childCounter, 0);
    assert.equal(sisterCounter, 0);

    await routerService.refresh();
    assert.equal(parentCounter, 2);
    assert.equal(childCounter, 0);
    assert.equal(sisterCounter, 0);

    await routerService.refresh('application');
    assert.equal(parentCounter, 3);
    assert.equal(childCounter, 0);
    assert.equal(sisterCounter, 0);

    await routerService.transitionTo('parent.child');
    assert.equal(parentCounter, 3);
    assert.equal(childCounter, 1);
    assert.equal(sisterCounter, 0);

    await routerService.refresh('parent.child');
    assert.equal(parentCounter, 3);
    assert.equal(childCounter, 2);
    assert.equal(sisterCounter, 0);

    await routerService.refresh('parent');
    assert.equal(parentCounter, 4);
    assert.equal(childCounter, 3);
    assert.equal(sisterCounter, 0);

    await routerService.transitionTo('parent.sister');
    assert.equal(parentCounter, 4);
    assert.equal(childCounter, 3);
    assert.equal(sisterCounter, 1);

    await routerService.refresh();
    assert.equal(parentCounter, 5);
    assert.equal(childCounter, 3);
    assert.equal(sisterCounter, 2);
  });

  test('it verifies that the provided route exists', async function (assert) {
    const routerService = this.owner.lookup('service:router');

    assert.throws(() => {
      routerService.refresh('this-route-does-not-exist');
    });
  });

  test('it verifies that the provided route is active', async function (assert) {
    const routerService = this.owner.lookup('service:router');

    assert.throws(() => {
      routerService.refresh('this-route-does-not-exist');
    });
  });
});
