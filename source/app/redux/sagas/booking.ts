import {all, select, takeEvery} from 'redux-saga/effects';
import {actionTypes, settingSelect} from '@redux';
import {
  Action,
  BookingDailyStyleModel,
  BookingHourlyStyleModel,
  PaymentModel,
  BookingSlotStyleModel,
  BookingStandardStyleModel,
  BookingTableStyleModel,
  PaginationModel,
  SortModel,
  BookingModel,
} from '@models+types';
import Api from '@api';

/**
 * on init booking form
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onInit(action: Action): Generator<any, void, any> {
  try {
    const response = yield Api.http.getBookingForm({
      params: {
        resource_id: action.item?.id,
      },
    });

    if (response.success) {
      let style;
      let payment;
      switch (response.data.type) {
        case 'daily':
          style = BookingDailyStyleModel.fromJson(response.data);
          break;
        case 'hourly':
          style = BookingHourlyStyleModel.fromJson(response.data);
          break;
        case 'table':
          style = BookingTableStyleModel.fromJson(response.data);
          break;
        case 'slot':
          style = BookingSlotStyleModel.fromJson(response.data);
          break;

        default:
          style = BookingStandardStyleModel.fromJson(response.data);
      }

      payment = PaymentModel.fromJson(response.payment);

      action?.callback?.({
        style,
        payment,
      });
    } else {
      Api.navigator?.showToast({
        message: response.message ?? response.msg,
        type: 'warning',
      });
    }
  } catch (error: any) {
    console.log('error', error);
    Api.navigator?.showToast({
      message: error.message,
      type: 'warning',
    });
  }
}

/**
 * on init booking form
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onCalcPrice(action: Action): Generator<any, void, any> {
  try {
    const response = yield Api.http.bookingCalcPrice({
      params: {
        resource_id: action.item?.id,
        ...action.bookingStyle?.params,
      },
    });
    if (response.success) {
      action?.callback?.({
        price: response.attr?.total_display,
      });
    } else {
      Api.navigator?.showToast({
        message: response.message ?? response.msg,
        type: 'warning',
      });
    }
  } catch (error: any) {
    Api.navigator?.showToast({
      message: error.message,
      type: 'warning',
    });
  }
}

/**
 * on order booking
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onOrder(action: Action): Generator<any, void, any> {
  try {
    const response = yield Api.http.bookingOrder({
      params: {
        resource_id: action.item?.id,
        payment_method: action.method?.id,
        first_name: action.contact?.firstName,
        last_name: action.contact?.lastName,
        email: action.contact?.email,
        phone: action.contact?.phone,
        address: action.contact?.address,
        memo: action.contact?.content,
        ...action.bookingStyle?.params,
      },
    });

    if (response.success) {
      const url = response.payment?.url ?? response.payment?.links?.[1]?.href;
      action?.callback?.(url);
    } else {
      Api.navigator?.showToast({
        message: response.message ?? response.msg,
        type: 'warning',
      });
    }
  } catch (error: any) {
    Api.navigator?.showToast({
      message: error.message,
      type: 'warning',
    });
  }
}

/**
 * on handle load list booking
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onLoadList(action: Action): Generator<any, void, any> {
  try {
    let api = Api.http.getBookingList;
    if (action.request) {
      api = Api.http.getRequestBookingList;
    }
    let params: any = {};
    if (action.status) {
      const arr = action.status.value.split('/');
      params.post_status = arr[1];
    }
    if (action.sort) {
      const arr = action.sort.value.split('/');
      params.orderby = arr[0];
      params.order = arr[1];
    }
    const setting = yield select(settingSelect);
    const response = yield api({
      params: {
        page: action.params?.page ?? 1,
        per_page: setting?.perPage,
        s: action.params?.keyword,
        ...params,
      },
    });

    if (response.success) {
      const data = response.data.map((item: any) => {
        return BookingModel.fromJson(item);
      });
      const pagination = PaginationModel.fromJson(response.pagination);
      const status = response.attr?.status?.map((item: any) => {
        return SortModel.fromJson(item);
      });
      const sort = response.attr?.sort?.map((item: any) => {
        return SortModel.fromJson(item);
      });
      action?.callback?.({data, pagination, status, sort});
    } else {
      Api.navigator?.showToast({
        message: response.message ?? response.msg,
        type: 'warning',
      });
    }
  } catch (error: any) {
    Api.navigator?.showToast({
      message: error.message,
      type: 'warning',
    });
  }
}

/**
 * on handle load list booking
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onLoadDetail(action: Action): Generator<any, void, any> {
  try {
    const response = yield Api.http.getBookingDetail({
      params: {id: action.item?.id},
    });

    if (response.success) {
      const data = BookingModel.fromJson(response.data);
      action?.callback?.(data);
    } else {
      Api.navigator?.showToast({
        message: response.message ?? response.msg,
        type: 'warning',
      });
    }
  } catch (error: any) {
    Api.navigator?.showToast({
      message: error.message,
      type: 'warning',
    });
  }
}

/**
 * on handle cancel booking
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onCancel(action: Action): Generator<any, void, any> {
  try {
    const response = yield Api.http.cancelBooking({
      params: {id: action.item?.id},
    });

    if (response.success) {
      const data = BookingModel.fromJson(response.data);
      action?.callback?.(data);
    } else {
      Api.navigator?.showToast({
        message: response.message ?? response.msg,
        type: 'warning',
      });
    }
  } catch (error: any) {
    Api.navigator?.showToast({
      message: error.message,
      type: 'warning',
    });
  }
}

/**
 * on handle accept booking
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onAccept(action: Action): Generator<any, void, any> {
  try {
    const response = yield Api.http.acceptBooking({
      params: {id: action.item?.id},
    });

    if (response.success) {
      const data = BookingModel.fromJson(response.data);
      action?.callback?.(data);
    } else {
      Api.navigator?.showToast({
        message: response.message ?? response.msg,
        type: 'warning',
      });
    }
  } catch (error: any) {
    Api.navigator?.showToast({
      message: error.message,
      type: 'warning',
    });
  }
}

function* watchInit() {
  yield takeEvery(actionTypes.INIT_BOOKING, onInit);
}

function* watchCalcPrice() {
  yield takeEvery(actionTypes.CALC_PRICE, onCalcPrice);
}

function* watchOrder() {
  yield takeEvery(actionTypes.ORDER, onOrder);
}

function* watchLoadList() {
  yield takeEvery(actionTypes.LOAD_BOOKING_LIST, onLoadList);
}

function* watchLoadDetail() {
  yield takeEvery(actionTypes.LOAD_DETAIL_BOOKING, onLoadDetail);
}

function* watchCancel() {
  yield takeEvery(actionTypes.CANCEL_BOOKING, onCancel);
}

function* watchAccept() {
  yield takeEvery(actionTypes.ACCEPT_BOOKING, onAccept);
}

export default function* wishlistSagas() {
  yield all([
    watchInit(),
    watchCalcPrice(),
    watchOrder(),
    watchLoadList(),
    watchLoadDetail(),
    watchCancel(),
    watchAccept(),
  ]);
}
