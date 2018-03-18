import { routerReducer } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import notifs from './modules/notifs';
import info from './modules/info';

export default function createReducers(asyncReducers) {
  return {
    router: routerReducer,
    online: (v = true) => v,
    form,
    notifs,
    info,
    ...asyncReducers
  };
}
