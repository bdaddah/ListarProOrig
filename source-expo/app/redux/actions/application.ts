import {Action} from '@models+types';
import {store, actionTypes} from '@redux';

export const onStart = (callback = () => {}): Action => {
  return store.dispatch({
    type: actionTypes.START_APPLICATION,
    callback,
  });
};

export const onChangeLanguage = (language: string) => {
  return store.dispatch({
    type: actionTypes.CHANGE_LANGUAGE,
    language,
  });
};

export const onDarkMode = (appearance: string) => {
  return store.dispatch({
    type: actionTypes.FORCE_APPEARANCE,
    appearance,
  });
};

export const onChangeFont = (font: string) => {
  return store.dispatch({
    type: actionTypes.CHANGE_FONT,
    font,
  });
};

export const onChangeDomain = (domain: string, callback = () => {}) => {
  return store.dispatch({
    type: actionTypes.CHANGE_DOMAIN,
    domain,
    callback,
  });
};

export const onChangeTheme = (theme: any) => {
  return store.dispatch({
    type: actionTypes.CHANGE_THEME,
    theme,
  });
};
