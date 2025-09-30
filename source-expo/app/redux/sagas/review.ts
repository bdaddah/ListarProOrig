import {all, put, select, takeEvery} from 'redux-saga/effects';
import {
  Action,
  CommentModel,
  PaginationModel,
  RateSummaryModel,
} from '@models+types';
import Api from '@api';
import {actionTypes, settingSelect} from '@redux';

/**
 * on handle load review
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onLoad(action: Action): Generator<any, void, any> {
  try {
    const response = yield Api.http.getReview({
      params: {post_id: action.item?.id},
    });

    if (response.success) {
      const data = response.data.map((item: any) => {
        return CommentModel.fromJson(item);
      });
      const summary = RateSummaryModel.fromJson(response.attr?.rating);
      yield put({type: actionTypes.SAVE_REVIEW, data, summary});
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
 * on handle add review
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onAdd(action: Action): Generator<any, void, any> {
  try {
    const response = yield Api.http.saveReview({
      params: action.params,
    });
    const success = response.code == null;
    if (success) {
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
 * on handle load author review
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onAuthorLoad(action: Action): Generator<any, void, any> {
  try {
    let sort = {};
    if (action.params?.sort) {
      const arr = action.params?.sort?.value?.split('/');
      sort = {
        orderby: arr[0],
        order: arr[1],
      };
    }

    const setting = yield select(settingSelect);
    const response = yield Api.http.getAuthorReview({
      params: {
        page: action.params?.page,
        per_page: setting?.perPage,
        s: action.params?.keyword,
        user_id: action.params?.userId,
        ...sort,
      },
    });

    if (response.success) {
      const data = response.data.map((item: any) => {
        return CommentModel.fromJson(item);
      });
      const pagination = PaginationModel.fromJson(response.pagination);
      action?.callback?.({pagination, data});
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
  yield takeEvery(actionTypes.LOAD_REVIEW, onLoad);
}

function* watchAdd() {
  yield takeEvery(actionTypes.ADD_REVIEW, onAdd);
}

function* watchLoadAuthor() {
  yield takeEvery(actionTypes.LOAD_AUTHOR_REVIEW, onAuthorLoad);
}

export default function* reviewSagas() {
  yield all([watchLoad(), watchAdd(), watchLoadAuthor()]);
}
