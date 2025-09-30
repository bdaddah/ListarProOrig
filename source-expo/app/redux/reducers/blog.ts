import {Action} from '@models+types';
import {actionTypes} from '@redux';

const initialState = {
  sticky: undefined,
  list: undefined,
  categories: undefined,
};

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case actionTypes.SAVE_BLOG:
      return action.data;

    default:
      return state;
  }
};
