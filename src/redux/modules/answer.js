import { LOAD_ANSWERS, LOADED_ANSWERS } from '../types/answers';

const initialState = {
  loaded: false,
  answers: []
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_ANSWERS:
      return {
        ...state,
        loading: true
      };
    case LOADED_ANSWERS:
      return {
        ...state,
        loading: false,
        loaded: true,
        answers: action.result
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.answers && globalState.answers.loaded;
}

export function load() {
  return {
    types: [LOAD_ANSWERS, LOADED_ANSWERS],
    promise: ({ app }) => app.service('answers').find()
  };
}
