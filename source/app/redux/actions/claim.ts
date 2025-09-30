import {actionTypes, store} from '@redux';
import {
  ClaimModel,
  PaymentMethodModel,
  ProductModel,
  SortModel,
} from '@models+types';

export const onSubmit = (
  item: ProductModel,
  data: any,
  callback: (data: any) => void,
) => {
  return store.dispatch({
    type: actionTypes.SUBMIT_CLAIM,
    item,
    data,
    callback,
  });
};

export const onLoadList = (
  params = {},
  status: SortModel | undefined,
  sort: SortModel | undefined,
  callback: (result: any) => void,
) => {
  return store.dispatch({
    type: actionTypes.LOAD_CLAIM_LIST,
    params,
    status,
    sort,
    callback,
  });
};

export const onDetail = (item: ClaimModel, callback: (result: any) => void) => {
  return store.dispatch({
    type: actionTypes.LOAD_CLAIM_DETAIL,
    item,
    callback,
  });
};

export const onPayment = (
  item: ClaimModel,
  method: PaymentMethodModel,
  callback: (result: any) => void,
) => {
  return store.dispatch({
    type: actionTypes.PAYMENT_CLAIM,
    item,
    method,
    callback,
  });
};

export const onAccept = (item: ClaimModel, callback: (result: any) => void) => {
  return store.dispatch({
    type: actionTypes.ACCEPT_CLAIM,
    item,
    callback,
  });
};

export const onCancel = (item: ClaimModel, callback: (result: any) => void) => {
  return store.dispatch({
    type: actionTypes.CANCEL_CLAIM,
    item,
    callback,
  });
};
