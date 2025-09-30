import {actionTypes, store} from '@redux';

export const onLoad = (callback = () => {}) => {
  return store.dispatch({
    type: actionTypes.LOAD_DISCOVERY,
    callback,
  });
};
