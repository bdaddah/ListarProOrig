import {ProductModel} from '@models+types';
import {actionTypes, store} from '@redux';

export const onLoad = (item: ProductModel, callback = () => {}) => {
  return store.dispatch({
    type: actionTypes.LOAD_REVIEW,
    item,
    callback,
  });
};

export const onAdd = (params: any, callback = () => {}) => {
  return store.dispatch({
    type: actionTypes.ADD_REVIEW,
    params,
    callback,
  });
};

export const onReset = () => {
  return store.dispatch({
    type: actionTypes.RESET_REVIEW,
  });
};

export const onLoadAuthorReview = (
  params = {},
  callback: (result: any) => void,
) => {
  return store.dispatch({
    type: actionTypes.LOAD_AUTHOR_REVIEW,
    params,
    callback,
  });
};
