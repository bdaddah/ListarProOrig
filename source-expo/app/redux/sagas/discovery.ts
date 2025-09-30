import {all, put, takeEvery} from 'redux-saga/effects';

import {Action, CategoryModel, ProductModel} from '@models+types';
import {actionTypes} from '@redux';
import Api from '@api';

/**
 * on handle load discovery list
 */
function* onLoad(action: Action): Generator<any, void, any> {
  try {
    const response = yield Api.http.getDiscovery();
    if (response.success) {
      const data = response.data.map((item: any) => {
        return {
          category: CategoryModel.fromJson(item),
          list: item.posts?.map((product: any) => {
            return ProductModel.fromJson(product);
          }),
        };
      });
      yield put({type: actionTypes.SAVE_DISCOVERY, data});
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

function* watchLoad() {
  yield takeEvery(actionTypes.LOAD_DISCOVERY, onLoad);
}

export default function* discoverySagas() {
  yield all([watchLoad()]);
}
