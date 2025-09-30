import {actionTypes, store} from '@redux';
import {BlogModel} from '@models+types';

export const onLoad = (params: any, callback = () => {}) => {
  return store.dispatch({
    type: actionTypes.LOAD_BLOG,
    params,
    callback,
  });
};

export const onDetail = (
  item: BlogModel,
  callback: (data: BlogModel) => void,
) => {
  return store.dispatch({
    type: actionTypes.DETAIL_BLOG,
    item,
    callback,
  });
};
