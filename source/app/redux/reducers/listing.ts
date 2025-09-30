import {Action} from '@models+types';
import {actionTypes} from '@redux';

const initialState = {
  data: null,
  pagination: {},
};

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case actionTypes.SAVE_LISTING:
      return {
        ...state,
        data: action.data,
        pagination: action.pagination,
      };

    case actionTypes.RESET_LISTING:
      return initialState;

    default:
      return state;
  }
};
