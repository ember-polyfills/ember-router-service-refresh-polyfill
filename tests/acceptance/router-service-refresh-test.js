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
    assert.strictEqual(parentCounter, 1);
    assert.strictEqual(childCounter, 0);
    assert.strictEqual(sisterCounter, 0);

    await routerService.refresh();
    assert.strictEqual(parentCounter, 2);
    assert.strictEqual(childCounter, 0);
    assert.strictEqual(sisterCounter, 0);

    await routerService.refresh('application');
    assert.strictEqual(parentCounter, 3);
    assert.strictEqual(childCounter, 0);
    assert.strictEqual(sisterCounter, 0);

    await routerService.transitionTo('parent.child');
    assert.strictEqual(parentCounter, 3);
    assert.strictEqual(childCounter, 1);
    assert.strictEqual(sisterCounter, 0);

    await routerService.refresh('parent.child');
    assert.strictEqual(parentCounter, 3);
    assert.strictEqual(childCounter, 2);
    assert.strictEqual(sisterCounter, 0);

    await routerService.refresh('parent');
    assert.strictEqual(parentCounter, 4);
    assert.strictEqual(childCounter, 3);
    assert.strictEqual(sisterCounter, 0);

    await routerService.transitionTo('parent.sister');
    assert.strictEqual(parentCounter, 4);
    assert.strictEqual(childCounter, 3);
    assert.strictEqual(sisterCounter, 1);

    await routerService.refresh();
    assert.strictEqual(parentCounter, 5);
    assert.strictEqual(childCounter, 3);
    assert.strictEqual(sisterCounter, 2);
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
