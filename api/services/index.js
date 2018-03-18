import questions from './questions';
import answers from './answers';
import types from './types';

export default function services() {
  const app = this;
  app.configure(questions);
  app.configure(answers);
  app.configure(types);
}
