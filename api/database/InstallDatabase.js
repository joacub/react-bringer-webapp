import bcrypt from 'bcryptjs';
import Bluebird from 'bluebird';
import sequelize from './InitSequelize';
import * as models from './Models';

// eslint-disable-next-line
function exit(exitCode, streams) {
  if (!streams) {
    streams = [process.stdout, process.stderr];
  }
  let drainCount = 0;

  // Actually exit if all streams are drained.
  function tryToExit() {
    if (drainCount === streams.length) {
      process.exit(exitCode);
    }
  }

  streams.forEach(stream => {
    // Count drained streams now, but monitor non-drained streams.
    if (stream.bufferSize === 0) {
      drainCount += 1;
    } else {
      stream.write('', 'utf-8', () => {
        drainCount += 1;
        tryToExit();
      });
    }
    // Prevent further writing.
    stream.write = () => {};
  });
  // If all streams were already drained, exit now.
  tryToExit();
  // In Windows, when run as a Node.js child process, a script utilizing
  // this library might just exit with a 0 exit code, regardless. This code,
  // despite the fact that it looks a bit crazy, appears to fix that.
  process.on('exit', () => {
    process.exit(exitCode);
  });
}

console.log('Init sync schema');

async function start() {
  const queryInterface = sequelize.getQueryInterface();
  const tableNames = await queryInterface.showAllTables();
  await Bluebird.map(tableNames, async tableName => {
    const constraints = await queryInterface.showConstraint(tableName);

    await Bluebird.map(constraints, async constraint => {
      if (sequelize.connectionManager.config.database === constraint.tableSchema) {
        if (constraint.constraintType === 'FOREIGN KEY') {
          await queryInterface.removeConstraint(tableName, constraint.constraintName);
          return true;
        }
        return true;
      }

      return true;
    });

    await Bluebird.map(constraints, async constraint => {
      if (sequelize.connectionManager.config.database === constraint.tableSchema) {
        if (constraint.constraintType === 'UNIQUE') {
          await queryInterface.removeConstraint(tableName, constraint.constraintName);
          return true;
        }
        return true;
      }

      return true;
    });

    return true;
  }).then(() => {
    console.log('Init sync');

    return sequelize
      .sync({ alter: true })
      .then(async () => {
        // Table created

        console.log('Init test data insert');
        const hash = bcrypt.hashSync('test-password', 10);

        await models.UserRoles.findOrCreate({
          where: { role: 'admin' },
          defaults: {
            role: 'admin'
          }
        }).spread(userRoleData => models.User.findOrCreate({
          where: {
            username: 'test',
            email: 'test@test.com'
          },
          defaults: {
            username: 'test',
            email: 'test@test.com',
            password: hash,
            description: '',
            UserRoleId: userRoleData.dataValues.id
          }
        }));

        await models.UserRoles.findOrCreate({
          where: { role: 'editor' },
          default: {
            role: 'editor'
          }
        });

        await models.UserRoles.findOrCreate({
          where: { role: 'user' },
          default: {
            role: 'user'
          }
        });

        process.on('exit', () => {
          console.log('End test data insert');
        });

        process.exit();
      })
      .catch(error => {
        console.log(error);
      });
  });

  process.exit();
}

start();
