import { test, skip } from 'qunit';
import { SHOULD_POLYFILL_ROUTER_SERVICE_REFRESH } from 'ember-router-service-refresh-polyfill/initializers/setup-router-service-refresh-polyfill';

export const testIfPolyfilled = SHOULD_POLYFILL_ROUTER_SERVICE_REFRESH
  ? test
  : skip;
