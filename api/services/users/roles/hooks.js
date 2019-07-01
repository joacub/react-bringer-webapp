import { validateHook } from 'hooks';

const schemaValidator = {};

function validate() {
  return hook => validateHook(schemaValidator)(hook);
}

const userRolesHooks = {
  before: {
    find: [],
    get: [],
    create: [validate()],
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
  }
};

export default userRolesHooks;
