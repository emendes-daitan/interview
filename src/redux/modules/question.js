import { LOAD_QUESTIONS, LOADED_QUESTIONS } from '../types/questions';

const initialState = {
  loaded: false,
  questions: []
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_QUESTIONS:
      return {
        ...state,
        loading: true
      };
    case LOADED_QUESTIONS:
      return {
        ...state,
        loading: false,
        loaded: true,
        questions: action.result
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.questions && globalState.questions.loaded;
}

export function load() {
  return {
    types: [LOAD_QUESTIONS, LOADED_QUESTIONS],
    promise: ({ app }) => app.service('questions').find()
  };
}
