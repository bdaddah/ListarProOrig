import {Reducer} from '@reduxjs/toolkit';
import {actionTypes} from '@redux';
import {Action} from '@models+types';

const initialState = {
  domain: undefined,
  theme: undefined,
  font: undefined,
  appearance: 'system_theme',
  language: undefined,
  setting: undefined,
  device: undefined,
};

const reducer: Reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case actionTypes.CHANGE_THEME:
      return {
        ...state,
        theme: action?.theme,
      };

    case actionTypes.CHANGE_FONT:
      return {
        ...state,
        font: action?.font,
      };

    case actionTypes.FORCE_APPEARANCE:
      return {
        ...state,
        appearance: action?.appearance,
      };

    case actionTypes.CHANGE_LANGUAGE:
      return {
        ...state,
        language: action?.language,
      };

    case actionTypes.SAVE_DOMAIN:
      return {
        ...state,
        domain: action?.domain,
      };

    case actionTypes.SAVE_DEVICE_INFO:
      return {
        ...state,
        device: {
          ...action?.device,
        },
      };

    case actionTypes.SAVE_SETTING:
      return {
        ...state,
        setting: {
          ...action?.setting,
        },
      };

    default:
      return state;
  }
};

export default reducer;
