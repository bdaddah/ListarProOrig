import {all, put, takeEvery} from 'redux-saga/effects';
import {actionTypes} from '@redux';
import {
  Action,
  AdmobWidgetModel,
  BannerWidgetModel,
  BlogWidgetModel,
  CategoryModel,
  CategoryWidgetModel,
  ImageModel,
  ListingWidgetModel,
  ProductModel,
  SliderWidgetModel,
  WidgetModel,
} from '@models+types';
import Api from '@api';

/**
 * on handle load home
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onLoad(action: Action): Generator<any, void, any> {
  try {
    const response = yield Api.http.getHome();
    if (response.success) {
      const banner = response.data?.sliders?.map((item: any) => {
        return new ImageModel({id: Date.now(), full: item, thumb: item});
      });
      const category = response.data?.categories?.map((item: any) => {
        return CategoryModel.fromJson(item);
      });
      const location = response.data?.locations?.map((item: any) => {
        return CategoryModel.fromJson(item);
      });
      const recent = response.data?.recent_posts?.map((item: any) => {
        return ProductModel.fromJson(item);
      });
      const data = {
        banner,
        category,
        location,
        recent,
      };
      yield put({type: actionTypes.SAVE_HOME, data});
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
 * on handle load home
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onLoadWidget(action: Action): Generator<any, void, any> {
  try {
    const response = yield Api.http.getHomeWidget({params: action.params});
    if (response.success) {
      const options = response.data?.options?.map((item: any) => {
        return CategoryModel.fromJson(item);
      });
      const header = {
        type: response.data?.header?.type,
        sliders: response.data?.header?.data?.map((item: any) => {
          return new ImageModel({id: Date.now(), full: item, thumb: item});
        }),
      };

      const widgets: WidgetModel[] = response.data?.widgets?.map(
        (item: any) => {
          const type: string = item.type;
          switch (type) {
            case 'category':
              return CategoryWidgetModel.fromJson(item);
            case 'admob':
              return AdmobWidgetModel.fromJson(item);
            case 'slider':
              return SliderWidgetModel.fromJson(item);
            case 'listing':
              return ListingWidgetModel.fromJson(item);
            case 'post':
              return BlogWidgetModel.fromJson(item);
            case 'banner':
              return BannerWidgetModel.fromJson(item);
            default:
              return CategoryWidgetModel.fromJson(item);
          }
        },
      );

      const data = {
        header,
        options,
        widgets,
      };
      yield put({type: actionTypes.SAVE_HOME, data});
      action.callback?.();
    } else {
      Api.navigator?.showToast({
        message: response.message ?? response.msg,
        type: 'warning',
      });
    }
  } catch (error: any) {
    action.callback?.();
    Api.navigator?.showToast({
      message: error.message,
      type: 'warning',
    });
  }
}

function* watchLoad() {
  yield takeEvery(actionTypes.LOAD_HOME, onLoad);
}

function* watchLoadWidget() {
  yield takeEvery(actionTypes.LOAD_HOME_WIDGET, onLoadWidget);
}

export default function* homeSagas() {
  yield all([watchLoad(), watchLoadWidget()]);
}
