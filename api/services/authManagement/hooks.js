import isEnabled from 'hooks/isEnabled';
import { hooks } from '@feathersjs/authentication';
import commonHooks from 'feathers-hooks-common';

const { authenticate } = hooks;

const isAction = () => {
  const args = Array.from(arguments); //eslint-disable-line
  return hook => args.includes(hook.data.action);
};

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [commonHooks.iff(isAction('passwordChange', 'identityChange'), [authenticate('jwt'), isEnabled()])],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
