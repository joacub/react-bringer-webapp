import express from '@feathersjs/express';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio';
import morgan from 'morgan';
import session from 'express-session';
import connectRedis from 'connect-redis';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import config from 'config';
import services from 'services';
import channels from 'channels';
// import { actionHandler } from 'middleware';
import auth from 'services/authentication';
import Redis from 'utils/Redis';
import PrettyError from 'pretty-error';
import isBot from 'isbot';

// import blocked from 'blocked';
//
// blocked(ms => {
//   console.warn('API ------>>> event loop blocked for', ms, 'ms');
// });

const pretty = new PrettyError();

// require('events').EventEmitter.defaultMaxListeners = 50;
require('events').EventEmitter.defaultMaxListeners = 0;

// eslint-disable-next-line
process.on('unhandledRejection', (reason, p) => console.error('Unhandled Rejection at: Promise ', p, pretty.render(reason)));

const RedisStore = connectRedis(session);
const app = express(feathers());
if (__DEVELOPMENT__) {
  app.use(morgan('dev'));
}
const redis = Redis();
app
  .set('config', config)
  .configure(_app => {
    Object.keys(config).forEach(name => {
      const value = config[name];
      _app.set(name, value);
    });
  })
  .use(redis)
  // .use(Cassandra())
  .use(cookieParser())
  .use((req, res, next) => session({
    store: new RedisStore({ client: req.redisdb }),
    secret: 'Bringer--secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
  })(req, res, next))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  // Core
  .configure(express.rest())
  .use((req, res, next) => {
    req.feathers.ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.ip;
    req.feathers.redisdb = req.redisdb;
    req.feathers.isSpider = isBot(req.headers['user-agent'] || '');
    next();
  })
  .configure(
    socketio(
      {
        path: '/ws',
        transports: ['websocket']
      },
      io => {
        io.use((socket, next) => {
          socket.redisdb = redis.client;
          next();
          // Exposing a request property to services and hooks
        });
      }
    )
  )
  .configure(auth)
  // .use(actionHandler(app))
  .configure(services)
  // .configure(() => {
  //   app.use('/upload', (req, res, next) => {
  //     upload.fileHandler()(req, res, next);
  //   });
  // })
  .configure(channels)
  // Final handlers
  .use(express.notFound())
  .use(
    express.errorHandler({
      logger: {
        error: error => {
          if (error && error.code !== 404) {
            console.error('API ERROR:', pretty.render(error));
          }
        },
        info: console.info
      }
    })
  );
// .use(notFound())
// .use(logger(app))
// .use(errorHandler());

if (process.env.APIPORT) {
  const server = app.listen(process.env.APIPORT, err => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> 🌎  API is running on port %s', process.env.APIPORT);
    console.info('==> 💻  Send requests to http://%s:%s', process.env.HOST, process.env.APIPORT);
  });

  process.on('SIGINT', () => {
    console.info('----\n==> 🌎  API process closed');
    server.close(err => {
      process.exit(err ? 1 : 0);
    });
  });
} else {
  console.error('==>     ERROR: No APIPORT environment variable has been specified');
}

app.io.on('connection', socket => {
  socket.feathers.ip = socket.handshake.headers['x-real-ip'] || socket.conn.remoteAddress;
  socket.feathers.isSpider = isBot(socket.handshake.headers['user-agent'] || '');
  socket.feathers.redisdb = socket.redisdb;
  // if (socket.feathers.headersSafe.cookie) {
  //   if (typeof socket.feathers.headersSafe.cookie === 'string') {
  //     socket.feathers.cookies = cookie.parse(socket.feathers.headersSafe.cookie);
  //   } else {
  //     // eslint-disable-next-line
  //     socket.feathers.cookies =
  //       Object.keys(socket.feathers.headersSafe.cookie).length > 0 ? socket.feathers.headersSafe.cookie : '';
  //   }
  // }
});
