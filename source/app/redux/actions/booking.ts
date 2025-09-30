import {actionTypes, store} from '@redux';
import {
  BookingModel,
  BookingStyleModel,
  PaymentMethodModel,
  ProductModel,
  SortModel,
} from '@models+types';

export const init = (item: ProductModel, callback: (data: any) => void) => {
  return store.dispatch({
    type: actionTypes.INIT_BOOKING,
    item,
    callback,
  });
};

export const onCalcPrice = (
  item: ProductModel,
  bookingStyle: BookingStyleModel,
  callback: (data: any) => void,
) => {
  return store.dispatch({
    type: actionTypes.CALC_PRICE,
    item,
    bookingStyle,
    callback,
  });
};

export const onOrder = (
  item: ProductModel,
  method: PaymentMethodModel,
  bookingStyle: BookingStyleModel,
  contact: any,
  callback: (uri: string) => void,
) => {
  return store.dispatch({
    type: actionTypes.ORDER,
    item,
    method,
    bookingStyle,
    contact,
    callback,
  });
};

export const onLoadList = (
  params = {},
  status: SortModel | undefined,
  sort: SortModel | undefined,
  request: boolean,
  callback: (result: any) => void,
) => {
  return store.dispatch({
    type: actionTypes.LOAD_BOOKING_LIST,
    params,
    status,
    sort,
    request,
    callback,
  });
};

export const onLoadDetail = (
  item: BookingModel,
  callback: (result: any) => void,
) => {
  return store.dispatch({
    type: actionTypes.LOAD_DETAIL_BOOKING,
    item,
    callback,
  });
};

export const onAccept = (
  item: BookingModel,
  callback: (result: any) => void,
) => {
  return store.dispatch({
    type: actionTypes.ACCEPT_BOOKING,
    item,
    callback,
  });
};

export const onCancel = (
  item: BookingModel,
  callback: (result: any) => void,
) => {
  return store.dispatch({
    type: actionTypes.CANCEL_BOOKING,
    item,
    callback,
  });
};
