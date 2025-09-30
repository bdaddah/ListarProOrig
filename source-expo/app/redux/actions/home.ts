import {actionTypes, store} from '@redux';

export const onLoad = (callback = () => {}) => {
  return store.dispatch({
    type: actionTypes.LOAD_HOME,
    callback,
  });
};

export const onLoadWidget = (callback = () => {}) => {
  return store.dispatch({
    type: actionTypes.LOAD_HOME_WIDGET,
    callback,
  });
};
