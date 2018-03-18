import { App, NotFound } from 'containers';
import Feedback from 'containers/Feedback/Loadable';

const routes = [
  {
    component: App,
    routes: [
      { path: '/', exact: true, component: Feedback },
      { path: '/feedback', component: Feedback },
      { component: NotFound }
    ]
  }
];

export default routes;
