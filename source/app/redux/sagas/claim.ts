import {all, select, takeEvery} from 'redux-saga/effects';
import {actionTypes, settingSelect} from '@redux';
import {Action, ClaimModel, PaginationModel, SortModel} from '@models+types';
import Api from '@api';

/**
 * on submit claim form
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onSubmit(action: Action): Generator<any, void, any> {
  try {
    const response = yield Api.http.submitClaim({
      params: {
        id: action.item?.id,
        first_name: action.data?.firstName,
        last_name: action.data?.lastName,
        email: action.data?.email,
        phone: action.data?.phone,
        memo: action.data?.content,
      },
    });
    if (response.success) {
      action.callback?.();
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
 * on handle load list claim
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onLoadList(action: Action): Generator<any, void, any> {
  try {
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
    const response = yield Api.http.getClaimList({
      params: {
        page: action.params?.page ?? 1,
        per_page: setting?.perPage,
        s: action.params?.keyword,
        ...params,
      },
    });

    if (response.success) {
      const data = response.data.map((item: any) => {
        return ClaimModel.fromJson(item);
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
 * on load detail claim
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onDetail(action: Action): Generator<any, void, any> {
  try {
    const response = yield Api.http.getClaimDetail({
      params: {id: action.item?.id},
    });

    if (response.success) {
      const data = ClaimModel.fromJson(response.data);
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
 * on load detail claim
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onAccept(action: Action): Generator<any, void, any> {
  try {
    const response = yield Api.http.acceptClaim({
      params: {id: action.item?.id},
    });

    if (response.success) {
      const data = ClaimModel.fromJson(response.data);
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
 * on load detail claim
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onCancel(action: Action): Generator<any, void, any> {
  try {
    const response = yield Api.http.cancelClaim({
      params: {id: action.item?.id},
    });

    if (response.success) {
      const data = ClaimModel.fromJson(response.data);
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
 * on payment claim
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onPayment(action: Action): Generator<any, void, any> {
  try {
    const response = yield Api.http.paymentClaim({
      params: {id: action.item?.id, payment_method: action.method?.id},
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

function* watchSubmit() {
  yield takeEvery(actionTypes.SUBMIT_CLAIM, onSubmit);
}

function* watchLoadList() {
  yield takeEvery(actionTypes.LOAD_CLAIM_LIST, onLoadList);
}

function* watchDetail() {
  yield takeEvery(actionTypes.LOAD_CLAIM_DETAIL, onDetail);
}

function* watchAccept() {
  yield takeEvery(actionTypes.ACCEPT_CLAIM, onAccept);
}

function* watchCancel() {
  yield takeEvery(actionTypes.CANCEL_CLAIM, onCancel);
}

function* watchPayment() {
  yield takeEvery(actionTypes.PAYMENT_CLAIM, onPayment);
}

export default function* wishlistSagas() {
  yield all([
    watchSubmit(),
    watchLoadList(),
    watchDetail(),
    watchAccept(),
    watchCancel(),
    watchPayment(),
  ]);
}
