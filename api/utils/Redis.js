import redis from 'redis';
import bluebird from 'bluebird';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const __DEV__ = process.env.NODE_ENV === 'development';

let client;

module.exports = (port = 6379, host = '127.0.0.1', options = {}, name = 'redisdb') => {
  if (!__DEV__) {
    options.path = '/var/run/redis/redis.sock';
  }
  client = redis.createClient(port, host, options);

  const f = (req, res, next) => {
    if (client.connected) {
      req[name] = client; // eslint-disable-line no-param-reassign
      next();
    } else {
      client.on('ready', () => {
        console.log('Redis connection ready.');
        req[name] = client; // eslint-disable-line no-param-reassign
        next();
      });
    }
  };

  // Expose the client in the return object.
  f.client = client;

  f.connect = next => {
    if (client && client.connected) {
      client.once('end', () => {
        client = redis.createClient(port, host, options, name);
        next();
      });
      client.quit();
    } else {
      client = redis.createClient(port, host, options, name);
      next();
    }
  };

  f.disconnect = next => {
    if (client) {
      client.once('end', () => {
        client = null;
        next();
      });
      client.quit();
      console.log('Redis disconnect.');
    } else {
      next();
    }
  };

  return f;
};
