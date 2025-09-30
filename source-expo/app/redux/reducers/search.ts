import {actionTypes} from '@redux';
import {Action} from '@models+types';

const initialState = {
  data: [],
  history: undefined,
  pagination: {},
};

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case actionTypes.SAVE_SEARCH:
      return {
        ...state,
        data: action.data,
        pagination: action.pagination,
      };

    case actionTypes.SAVE_HISTORY:
      return {
        ...state,
        history: [...(state.history ?? []), action.item],
      };

    case actionTypes.RESET_SEARCH:
      return {
        ...state,
        data: [],
        pagination: {},
      };

    case actionTypes.CLEAR_HISTORY:
      return {
        ...state,
        history: undefined,
      };

    default:
      return state;
  }
};
