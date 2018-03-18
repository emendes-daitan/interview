import feathersNedb from 'feathers-nedb';
import NeDB from 'nedb';
import hooks from './hooks';

export default function typeService() {
  const app = this;

  const options = {
    Model: new NeDB({
      filename: `${__dirname}/types.nedb`,
      autoload: true
    })
  };

  app.use('/types', feathersNedb(options));

  app.service('types').hooks(hooks);
}
