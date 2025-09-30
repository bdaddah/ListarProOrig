import {all, debounce, takeEvery} from 'redux-saga/effects';
import {Action, CategoryModel} from '@models+types';
import Api from '@api';
import {actionTypes} from '@redux';

/**
 * on handle load category list
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onLoad(action: Action): Generator<any, void, any> {
  try {
    const params: any = {};
    if (action.item) {
      params.category_id = action.item?.id;
    }

    const response = yield Api.http.getCategory({
      params,
    });

    if (response.success) {
      let data = response.data?.map((item: any) => {
        return CategoryModel.fromJson(item);
      });
      data = data.filter((item: any) =>
        item.title
          .toUpperCase()
          .includes(action.keyword?.toUpperCase?.() ?? ''),
      );
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
 * load location category
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onLoadLocation(action: Action): Generator<any, void, any> {
  try {
    const response = yield Api.http.getLocation({
      params: {parent_id: action.item?.id},
      loading: true,
    });

    if (response.success) {
      const data = response.data?.map((item: any) => {
        return CategoryModel.fromJson(item);
      });
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

function* watchList() {
  yield debounce(500, actionTypes.LOAD_CATEGORY_LIST, onLoad);
}

function* watchLoadLocation() {
  yield takeEvery(actionTypes.LOAD_LOCATION, onLoadLocation);
}

export default function* categorySagas() {
  yield all([watchList(), watchLoadLocation()]);
}
