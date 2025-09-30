import {actionTypes, store} from '@redux';
import {ProductModel} from '@models+types';

export const onSearch = (params: any, callback = () => {}) => {
  return store.dispatch({
    type: actionTypes.LOAD_SEARCH,
    params,
    callback,
  });
};

export const onLoadMore = (params: any) => {
  return store.dispatch({
    type: actionTypes.LOAD_MORE_SEARCH,
    params,
  });
};

export const onReset = () => {
  return store.dispatch({
    type: actionTypes.RESET_SEARCH,
  });
};

export const onAddHistory = (item: ProductModel) => {
  return store.dispatch({
    type: actionTypes.SAVE_HISTORY,
    item,
  });
};

export const onClearHistory = () => {
  return store.dispatch({
    type: actionTypes.CLEAR_HISTORY,
  });
};
