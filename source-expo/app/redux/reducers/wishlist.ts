import {actionTypes} from '@redux';
import {Action} from '@models+types';

const initialState = {
  data: undefined,
  pagination: {},
};

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case actionTypes.SAVE_WISHLIST:
      return {
        ...state,
        data: action.data,
        pagination: action.pagination,
      };

    case actionTypes.RESET_WISHLIST:
      return initialState;

    default:
      return state;
  }
};
