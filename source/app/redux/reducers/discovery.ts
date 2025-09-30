import {Action} from '@models+types';
import {actionTypes} from '@redux';

const initialState = null;

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case actionTypes.SAVE_DISCOVERY:
      return action.data;

    default:
      return state;
  }
};
