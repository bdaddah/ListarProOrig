import {actionTypes, store} from '@redux';
import {CategoryModel} from '@models+types';

export const onLoad = (
  item: CategoryModel,
  keyword: string,
  callback: (data: []) => void,
) => {
  return store.dispatch({
    type: actionTypes.LOAD_CATEGORY_LIST,
    item,
    keyword,
    callback,
  });
};

export const onLoadLocation = (
  item: CategoryModel,
  callback: (data: CategoryModel[]) => void,
) => {
  return store.dispatch({
    type: actionTypes.LOAD_LOCATION,
    item,
    callback,
  });
};
