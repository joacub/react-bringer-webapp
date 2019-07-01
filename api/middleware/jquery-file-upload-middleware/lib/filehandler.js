import errors from '@feathersjs/errors';
import { authenticate } from '@feathersjs/authentication';

module.exports = (middleware, options) => (req, res, next) => {
  if (req.cookies && req.cookies['feathers-jwt']) {
    req.params.authentication = {
      strategy: 'jwt',
      accessToken: req.cookies['feathers-jwt']
    };
  } else {
    next();
    return;
  }
  authenticate({ strategies: ['jwt'] })(req)
    .then(resultAuth => {
      if (!resultAuth) {
        next(new errors.NotAuthenticated('Cannot check if the user is enabled. You must not be authenticated.'));
        return;
      }

      req.user = resultAuth.params.user;

      res.set({
        'Access-Control-Allow-Origin': options.accessControl.allowOrigin,
        'Access-Control-Allow-Methods': options.accessControl.allowMethods
      });
      const UploadHandler = require('./uploadhandler')(options);
      const handler = new UploadHandler(req, res, (result, redirect) => {
        if (redirect) {
          const files = { files: result };
          res.redirect(redirect.replace(/%s/, encodeURIComponent(JSON.stringify(files))));
        } else {
          res.set({
            'Content-Type':
              (req.headers.accept || '').indexOf('application/json') !== -1 ? 'application/json' : 'text/plain'
          });
          res.status(200).json(result);
        }
      });

      handler.on('begin', fileInfo => {
        middleware.emit('begin', fileInfo, req, res);
      });
      handler.on('end', fileInfo => {
        middleware.emit('end', fileInfo, req, res);
      });
      handler.on('abort', fileInfo => {
        middleware.emit('abort', fileInfo, req, res);
      });
      handler.on('error', e => {
        middleware.emit('abort', e, req, res);
      });
      handler.on('delete', fileName => {
        middleware.emit('delete', fileName, req, res);
      });

      switch (req.method) {
        case 'OPTIONS':
          res.end();
          break;
        case 'HEAD':
        case 'GET':
          handler.get();
          break;
        case 'POST':
          handler.post();
          break;
        case 'DELETE':
          handler.destroy();

          break;
        default:
          res.send(405);
      }
    });
};
