import {actionTypes, store} from '@redux';
import {FilterModel, PaymentModel, ProductModel} from '@models+types';

export const onDetail = (
  item: ProductModel,
  callback: (data: ProductModel) => void,
) => {
  return store.dispatch({
    type: actionTypes.LISTING_DETAIL,
    item,
    callback,
  });
};

export const onLoadList = (filter: FilterModel, callback = () => {}) => {
  return store.dispatch({
    type: actionTypes.LOAD_LISTING,
    filter,
    callback,
  });
};

export const onLoadAuthorList = (
  filter: FilterModel,
  params = {},
  callback: (result: any) => void,
) => {
  return store.dispatch({
    type: actionTypes.LOAD_AUTHOR_LISTING,
    filter,
    params,
    callback,
  });
};

export const onDelete = (item: ProductModel, callback = () => {}) => {
  return store.dispatch({
    type: actionTypes.DELETE_LISTING_ITEM,
    item,
    callback,
  });
};

export const initSubmit = (
  item: ProductModel,
  callback: (result: any) => void,
) => {
  return store.dispatch({
    type: actionTypes.INIT_SUBMIT_SETTING,
    item,
    callback,
  });
};

export const onLoadTags = (
  keyword: string,
  callback: (result: any) => void,
) => {
  return store.dispatch({
    type: actionTypes.LOAD_TAGS,
    keyword,
    callback,
  });
};

export const onLoadMore = () => {
  return store.dispatch({
    type: actionTypes.LOAD_MORE_LISTING,
  });
};

export const onClear = () => {
  return store.dispatch({
    type: actionTypes.RESET_LISTING,
  });
};

export const onSubmit = (data: any, callback: () => void) => {
  return store.dispatch({
    type: actionTypes.SUBMIT,
    data,
    callback,
  });
};

export const onPayment = (callback: (method: PaymentModel) => void) => {
  return store.dispatch({
    type: actionTypes.REQUEST_PAYMENT,
    callback,
  });
};

export const onLoadMyListings = (
  filter: FilterModel,
  params: any,
  callback: (result: any) => void,
) => {
  return store.dispatch({
    type: actionTypes.LOAD_MY_LISTINGS,
    filter,
    params,
    callback,
  });
};

export const onLoadPendingListings = (
  filter: FilterModel,
  params: any,
  callback: (result: any) => void,
) => {
  return store.dispatch({
    type: actionTypes.LOAD_PENDING_LISTINGS,
    filter,
    params,
    callback,
  });
};

export const onUpdateListingStatus = (
  listingId: number,
  status: string,
  callback: (success: boolean) => void,
) => {
  return store.dispatch({
    type: actionTypes.UPDATE_LISTING_STATUS,
    listingId,
    status,
    callback,
  });
};
