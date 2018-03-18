import feathersNedb from 'feathers-nedb';
import NeDB from 'nedb';
import hooks from './hooks';

export default function questionService() {
  const app = this;

  const options = {
    Model: new NeDB({
      filename: `${__dirname}/questions.nedb`,
      autoload: true
    })
  };

  app.use('/questions', feathersNedb(options));

  app.service('questions').hooks(hooks);
}
