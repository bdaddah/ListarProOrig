import {Reducer} from '@reduxjs/toolkit';
import {actionTypes} from '@redux';
import {Action} from '@models+types';

const initialState = {
  user: undefined,
};

const reducer: Reducer = (state = initialState, action: Action) => {
  switch (action?.type) {
    case actionTypes.SAVE_USER:
      return {
        ...state,
        user: {...state.user, ...action?.user},
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

export default reducer;
