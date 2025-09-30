import {actionTypes} from '../actions';
import {store} from '@redux';
import {ProductModel} from '@models+types';

export const onLoad = (callback = () => {}) => {
  return store.dispatch({
    type: actionTypes.LOAD_WISHLIST,
    callback,
  });
};

export const onAdd = (item: ProductModel, callback = () => {}) => {
  return store.dispatch({
    type: actionTypes.ADD_WISHLIST,
    item,
    callback,
  });
};

export const onDeleted = (item: ProductModel, callback = () => {}) => {
  return store.dispatch({
    type: actionTypes.DELETE_WISHLIST,
    item,
    callback,
  });
};

export const onClear = () => {
  return store.dispatch({
    type: actionTypes.CLEAR_WISHLIST,
  });
};

export const onLoadMore = () => {
  return store.dispatch({
    type: actionTypes.LOAD_MORE_WISHLIST,
  });
};
