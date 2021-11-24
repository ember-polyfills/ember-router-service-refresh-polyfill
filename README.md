ember-router-service-refresh-polyfill
==============================================================================

Polyfills the RouterService#refresh method as described in [RFC 631](https://emberjs.github.io/rfcs/0631-refresh-method-for-router-service.html).


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.4 or above. The polyfill is disabled in Ember 4.1 and above.
* Ember CLI v3.4 or above
* Embroider safe and optimized
* Node.js v12 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-router-service-refresh-polyfill
```


Usage
------------------------------------------------------------------------------

This addon polyfills the RouterService#refresh method which refreshes all currently active routes, doing a full transition.

If a `routeName` is provided and refers to a currently active route,
it will refresh only that route and its descendents.

It returns a [Transition](https://api.emberjs.com/ember/release/classes/Transition) that will be resolved once the refresh is complete.
All resetController, beforeModel, model, afterModel, redirect, and setupController
hooks will be called again. You will get new data from the model hook.

### Example

```js
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

export default class VeryRealComponent extends Component {
  @service('router') routerService;

  @action
  refreshAllActiveRoutes() {
    this.routerService.refresh();
  }

  @action
  refreshNamedActiveRoute() {
    this.routerService.refresh('some-active-route-name');
  }
}
```

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
