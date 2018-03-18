import { LOAD_TYPES, LOADED_TYPES } from '../types/types';

const initialState = {
  loaded: false,
  types: []
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_TYPES:
      return {
        ...state,
        loading: true
      };
    case LOADED_TYPES:
      return {
        ...state,
        loading: false,
        loaded: true,
        types: action.result
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.types && globalState.types.loaded;
}

export function load() {
  return {
    types: [LOAD_TYPES, LOADED_TYPES],
    promise: ({ app }) => app.service('types').find()
  };
}
