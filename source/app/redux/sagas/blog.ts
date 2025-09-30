import {all, debounce, put, takeEvery} from 'redux-saga/effects';

import {Action, BlogModel, CategoryModel} from '@models+types';
import {actionTypes} from '@redux';
import Api from '@api';

/**
 * on handle load blog list
 */
function* onLoad(action: Action): Generator<any, void, any> {
  try {
    let orderby, order;
    if (action.params?.sort) {
      const sort = action.params.sort.value.split('/');
      orderby = sort[0];
      order = sort[1];
    }
    const response = yield Api.http.getBlog({
      params: {
        s: action.params?.keyword,
        category: action.params?.category?.id,
        orderby,
        order,
      },
    });
    if (response.success) {
      let sticky;
      const list = response?.posts?.map?.((item: any) => {
        return BlogModel.fromJson(item);
      });
      const categories = response?.categories?.map?.((item: any) => {
        return CategoryModel.fromJson(item);
      });
      if (response.sticky != null) {
        sticky = BlogModel.fromJson(response.sticky);
      }

      yield put({
        type: actionTypes.SAVE_BLOG,
        data: {list, categories, sticky},
      });
      action?.callback?.();
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
 * on handle load detail blog
 */
function* onDetail(action: Action): Generator<any, void, any> {
  try {
    const response = yield Api.http.getBlogDetail({
      params: {id: action.item.id},
    });
    if (response.success) {
      const data = BlogModel.fromJson(response.data);
      action?.callback?.(data);
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

function* watchLoad() {
  yield debounce(500, actionTypes.LOAD_BLOG, onLoad);
}

function* watchLoadDetail() {
  yield takeEvery(actionTypes.DETAIL_BLOG, onDetail);
}

export default function* blogSagas() {
  yield all([watchLoad(), watchLoadDetail()]);
}
