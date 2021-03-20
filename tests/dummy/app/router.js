/* eslint-disable ember/no-classic-classes */
import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,
});

Router.map(function () {
  this.route('parent', { path: '/' }, function () {
    this.route('child');
    this.route('sister');
  });
});

export default Router;
