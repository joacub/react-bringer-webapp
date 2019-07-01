import models from 'express-cassandra';

export default () => {
  // Tell express-cassandra to use the models-directory, and
  // use bind() to load the models using cassandra configurations.
  const bind = models
    .setDirectory(`${__dirname}/cassandra-models`)
    .bindAsync({
      clientOptions: {
        contactPoints: ['127.0.0.1'],
        protocolOptions: { port: 9042 },
        keyspace: 'crypto',
        queryOptions: { consistency: models.consistencies.one }
      },
      ormOptions: {
        udts: {
          marketminmax: {
            min: 'float',
            max: 'float'
          },
          marketlimits: {
            amount: 'frozen<marketminmax>',
            price: 'frozen<marketminmax>',
            cost: 'frozen<marketminmax>'
          },
          marketprecision: {
            amount: 'int',
            price: 'int'
          }
        },
        defaultReplicationStrategy: {
          class: 'SimpleStrategy',
          replication_factor: 1
        },
        migration: 'alter'
      }
    })
    .then(err => {
      if (err) throw err;

      console.info('----\n==> 🌎  CASSANDRA started');
      // You'll now have a `person` table in cassandra created against the model
      // schema you've defined earlier and you can now access the model instance
      // in `models.instance.Person` object containing supported orm operations.
    });
  const start = (req, res, next) => {
    req.cassandra = models;
    next();
  };

  start.client = models;
  start.bind = bind;

  return start;
};
