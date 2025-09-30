import {all, debounce, put, select, takeEvery} from 'redux-saga/effects';
import {actionTypes, settingSelect, wishlistSelect} from '@redux';
import {Action, PaginationModel, ProductModel} from '@models+types';
import Api from '@api';

/**
 * on handle load wishlist
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onLoad(action: Action): Generator<any, void, any> {
  try {
    const setting = yield select(settingSelect);
    const response = yield Api.http.getWishList({
      params: {
        page: 1,
        per_page: setting?.perPage,
      },
    });
    if (response.success) {
      const data = response.data.map((item: any) => {
        return ProductModel.fromJson(item);
      });
      const pagination = PaginationModel.fromJson(response.pagination);
      yield put({type: actionTypes.SAVE_WISHLIST, data, pagination});
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
 * on handle load more wishlist
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onLoadMore(action: Action): Generator<any, void, any> {
  try {
    const setting = yield select(settingSelect);
    const wishlist = yield select(wishlistSelect);
    const response = yield Api.http.getWishList({
      params: {
        page: wishlist.pagination.page + 1,
        per_page: setting?.perPage,
      },
    });

    if (response.success) {
      const data = response.data.map((item: any) => {
        return ProductModel.fromJson(item);
      });
      const pagination = PaginationModel.fromJson(response.pagination);
      yield put({
        type: actionTypes.SAVE_WISHLIST,
        data: [...wishlist.data, ...data],
        pagination,
      });
      action?.callback?.();
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
 * on handle add wishlist
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onAdd(action: Action): Generator<any, void, any> {
  try {
    const response = yield Api.http.addWishList({
      params: {post_id: action.item?.id},
    });

    if (response.success) {
      yield put({type: actionTypes.LOAD_WISHLIST});
      action?.callback?.();
      Api.navigator?.showToast({
        message: response.message,
        type: 'success',
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
 * on handle clear wishlist
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onClear(action: Action): Generator<any, void, any> {
  try {
    const response = yield Api.http.clearWishList();
    if (response.success) {
      yield put({type: actionTypes.SAVE_WISHLIST, data: [], pagination: {}});
      action?.callback?.();
      Api.navigator?.showToast({
        message: response.message,
        type: 'success',
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
 * on handle delete wishlist
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onDelete(action: Action): Generator<any, void, any> {
  try {
    const response = yield Api.http.removeWishList({
      params: {
        post_id: action.item?.id,
      },
    });
    if (response.success) {
      yield put({type: actionTypes.LOAD_WISHLIST});
      action?.callback?.();
      Api.navigator?.showToast({
        message: response.message,
        type: 'success',
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

function* watchLoad() {
  yield takeEvery(actionTypes.LOAD_WISHLIST, onLoad);
}

function* watchAdd() {
  yield takeEvery(actionTypes.ADD_WISHLIST, onAdd);
}

function* watchClear() {
  yield takeEvery(actionTypes.CLEAR_WISHLIST, onClear);
}

function* watchDelete() {
  yield takeEvery(actionTypes.DELETE_WISHLIST, onDelete);
}

function* watchLoadMore() {
  yield debounce(250, actionTypes.LOAD_MORE_WISHLIST, onLoadMore);
}

export default function* wishlistSagas() {
  yield all([
    watchLoad(),
    watchAdd(),
    watchClear(),
    watchDelete(),
    watchLoadMore(),
  ]);
}
