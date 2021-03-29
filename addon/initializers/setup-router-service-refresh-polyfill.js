/* eslint-disable ember/no-private-routing-service */
import { assert } from '@ember/debug';
import { getOwner } from '@ember/application';
import { dependencySatisfies, macroCondition } from '@embroider/macros';

export const SHOULD_POLYFILL_ROUTER_SERVICE_REFRESH = !dependencySatisfies(
  'ember-source',
  '^4.1.0-beta.1' // https://github.com/emberjs/ember.js/blob/master/CHANGELOG.md#v410-beta1-november-19-2021
);

export function initialize(application) {
  if (macroCondition(SHOULD_POLYFILL_ROUTER_SERVICE_REFRESH)) {
    const RouterService = application.resolveRegistration('service:router');

    RouterService.reopen({
      /**
       * Refreshes all currently active routes, doing a full transition.
       * If a routeName is provided and refers to a currently active route,
       * it will refresh only that route and its descendents.
       * Returns a promise that will be resolved once the refresh is complete.
       * All resetController, beforeModel, model, afterModel, redirect, and setupController
       * hooks will be called again. You will get new data from the model hook.
       *
       * @method refresh
       * @param {String} [routeName] the route to refresh (along with all child routes)
       * @return Transition
       * @public
       */
      refresh(routeName) {
        if (!routeName) {
          return this._router._routerMicrolib.refresh();
        }

        assert(
          `The route "${routeName}" was not found`,
          this._router.hasRoute(routeName)
        );

        assert(
          `The route "${routeName}" is currently not active`,
          this.isActive(routeName)
        );

        let owner = getOwner(this);
        let pivotRoute = owner.lookup(`route:${routeName}`);

        return this._router._routerMicrolib.refresh(pivotRoute);
      },
    });
  }
}

export default {
  initialize,
};
