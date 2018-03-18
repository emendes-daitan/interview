import { disallow } from 'feathers-hooks-common';

const questionsHooks = {
  before: {
    all: [],
    find: [],
    get: [],
    create: disallow(),
    update: disallow(),
    patch: disallow(),
    remove: disallow()
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

export default questionsHooks;
