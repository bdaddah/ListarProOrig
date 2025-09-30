import {all, debounce, put, select} from 'redux-saga/effects';
import Api from '@api';
import {Action, PaginationModel, ProductModel} from '@models+types';
import {actionTypes, searchSelect, settingSelect} from '@redux';

/**
 * on handle load search
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onLoad(action: Action): Generator<any, void, any> {
  try {
    yield put({
      type: actionTypes.SAVE_SEARCH,
      data: undefined,
    });
    const setting = yield select(settingSelect);
    const response = yield Api.http.getListing({
      params: {
        s: action.params?.keyword,
        page: 1,
        per_page: setting?.perPage,
      },
    });
    if (response.success) {
      const data = response.data.map((item: any) => {
        return ProductModel.fromJson(item);
      });
      const pagination = PaginationModel.fromJson(response.pagination);
      yield put({type: actionTypes.SAVE_SEARCH, data, pagination});
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
 * on load more search
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onLoadMore(action: Action): Generator<any, void, any> {
  try {
    const setting = yield select(settingSelect);
    const search = yield select(searchSelect);
    const response = yield Api.http.getListing({
      params: {
        s: action.params?.keyword,
        page: search.pagination.page + 1,
        per_page: setting?.perPage,
      },
    });
    if (response.success) {
      const data = response.data.map((item: any) => {
        return ProductModel.fromJson(item);
      });
      const pagination = PaginationModel.fromJson(response.pagination);
      yield put({
        type: actionTypes.SAVE_SEARCH,
        data: [...search.data, ...data],
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

function* watchSearch() {
  yield debounce(500, actionTypes.LOAD_SEARCH, onLoad);
}

function* watchLoadMore() {
  yield debounce(250, actionTypes.LOAD_MORE_SEARCH, onLoadMore);
}

export default function* searchSagas() {
  yield all([watchSearch(), watchLoadMore()]);
}
