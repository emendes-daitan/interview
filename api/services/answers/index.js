import feathersNedb from 'feathers-nedb';
import NeDB from 'nedb';
import hooks from './hooks';

export default function answerService() {
  const app = this;

  const options = {
    Model: new NeDB({
      filename: `${__dirname}/answers.nedb`,
      autoload: true
    })
  };

  app.use('/answers', feathersNedb(options));

  app.service('answers').hooks(hooks);
}
