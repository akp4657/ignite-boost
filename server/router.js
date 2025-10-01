const controllers = require('./controllers');
const mid = require('./middleware');

// Really lazy way to do this
const prefix = '/api';

const router = (app) => {
  app.get(`${prefix}/auth`, controllers.Account.auth);
  app.get(`${prefix}/getToken`, mid.requiresSecure, controllers.Account.getToken);
  app.get(`${prefix}/getVideos`, mid.requiresLogin, controllers.Video.getVideos);
  app.get(`${prefix}/getAllVideos`, controllers.Video.getAllVideos);
  app.get(`${prefix}/search`, controllers.Video.searchVideos);
  app.post(`${prefix}/sendReport`, controllers.Account.sendReport);
  app.post(`${prefix}/passChange`, mid.requiresLogin, controllers.Account.passChange);
  app.post(`${prefix}/login`, mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post(`${prefix}/signup`, mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get(`${prefix}/logout`, mid.requiresLogin, controllers.Account.logout);
  app.post(`${prefix}/makeVideos`, mid.requiresLogin, controllers.Video.makeVideos);
};

module.exports = router;
