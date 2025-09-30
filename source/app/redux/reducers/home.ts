import {actionTypes} from '@redux';
import {Action} from '@models+types';

const initialState = {};

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case actionTypes.SAVE_HOME:
      return {
        ...state,
        ...action?.data,
      };

    default:
      return state;
  }
};
