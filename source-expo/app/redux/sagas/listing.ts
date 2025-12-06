import {all, debounce, put, select, takeEvery} from 'redux-saga/effects';

import Api from '@api';
import {actionTypes, listingSelect, settingSelect} from '@redux';
import {
  Action,
  CategoryModel,
  ImageModel,
  PaginationModel,
  PaymentModel,
  ProductModel,
  SubmitSettingModel,
  UserModel,
} from '@models+types';
import {getCurrentLocation} from '@utils';
import moment from 'moment';

/**
 * on handle load listing
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onLoadList(action: Action): Generator<any, void, any> {
  try {
    let params = {};
    if (action.filter) {
      params = yield action.filter.getParams();
    }
    const setting = yield select(settingSelect);
    const response = yield Api.http.getListing({
      params: {
        page: 1,
        per_page: setting?.perPage,
        ...params,
      },
    });

    if (response.success) {
      const data = response.data.map((item: any) => {
        return ProductModel.fromJson(item);
      });
      const pagination = PaginationModel.fromJson(response.pagination);
      yield put({type: actionTypes.SAVE_LISTING, data, pagination});
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
 * on handle load more listing
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onLoadMore(action: Action): Generator<any, void, any> {
  try {
    let params = {};
    if (action?.filter) {
      params = yield action.filter.getParams();
    }
    const setting = yield select(settingSelect);
    const listing = yield select(listingSelect);

    const response = yield Api.http.getListing({
      params: {
        page: listing.pagination.page + 1,
        per_page: setting?.perPage,
        ...params,
      },
    });

    if (response.success) {
      const data = response.data.map((item: any) => {
        return ProductModel.fromJson(item);
      });
      const pagination = PaginationModel.fromJson(response.pagination);
      yield put({
        type: actionTypes.SAVE_LISTING,
        data: [...listing.data, ...data],
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
 * on detail listing
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onLoadDetail(action: Action): Generator<any, void, any> {
  try {
    const params: any = {id: action.item?.id};
    const result = yield getCurrentLocation();
    if (result) {
      params.latitude = result.latitude;
      params.longitude = result.longitude;
    }

    const response = yield Api.http.getProduct({params});
    if (response.success) {
      const data = ProductModel.fromJson(response.data);
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
 * on handle load author listing
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onLoadAuthorList(action: Action): Generator<any, void, any> {
  try {
    const setting = yield select(settingSelect);

    let params: any = {
      page: action.params?.page,
      per_page: setting?.perPage,
      s: action.params?.keyword,
      user_id: action.params?.userId,
      post_status: action.params?.pending ? 'pending' : undefined,
    };

    if (action.params?.pending === true) {
      params.post_status = 'pending';
    }

    if (action.filter) {
      const filter = yield action.filter.getParams();
      params = {
        ...params,
        ...filter,
      };
    }
    const response = yield Api.http.getAuthorList({
      params,
    });

    if (response.success) {
      const user = UserModel.fromJson(response.user);
      const data = response.data.map((item: any) => {
        return ProductModel.fromJson(item);
      });
      const pagination = PaginationModel.fromJson(response.pagination);
      action?.callback?.({user, pagination, data});
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
 * on delete item listing
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onDeleteItem(action: Action): Generator<any, void, any> {
  try {
    const response = yield Api.http.deleteProduct({
      params: {post_id: action.item?.id},
    });
    if (response.success) {
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
 * on init submit
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onInitSubmit(action: Action): Generator<any, void, any> {
  try {
    let setting;
    let product;
    let responseSetting;
    let responseProduct;
    if (action.item) {
      [responseSetting, responseProduct] = yield Promise.all([
        Api.http.getSubmitSetting({
          params: {post_id: action.item?.id},
        }),
        Api.http.getProduct({params: {id: action.item?.id}}),
      ]);
    } else {
      responseSetting = yield Api.http.getSubmitSetting({});
    }
    setting = SubmitSettingModel.fromJson(responseSetting?.data || responseSetting);
    if (responseProduct?.success) {
      product = ProductModel.fromJson(responseProduct.data);
    }
    if (setting) {
      action?.callback?.({
        setting,
        product,
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
 * on submit/edit listing
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onLoadTags(action: Action): Generator<any, void, any> {
  try {
    const response = yield Api.http.getTags({
      params: {s: action.keyword},
    });
    if (response.success) {
      const data = response.data.map((item: any) => {
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

/**
 * on load tags submit
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onSubmit(action: Action): Generator<any, void, any> {
  try {
    const params: any = {
      post_id: action.data?.id,
      title: action.data?.title,
      content: action.data?.content,
      country: action.data?.country?.id,
      state: action.data?.state?.id,
      city: action.data?.city?.id,
      address: action.data?.address,
      zip_code: action.data?.zipcode,
      phone: action.data?.phone,
      fax: action.data?.fax,
      email: action.data?.email,
      website: action.data?.website,
      color: action.data?.color,
      icon: action.data?.icon,
      status: action.data?.status,
      date_establish: moment(action.data?.dateEstablish)?.format('YYYY-MM-DD'),
      thumbnail: action.data?.featureImage?.id,
      gallery: action.data?.galleryImages
        ?.map((item: ImageModel) => item.id)
        .join(','),
      booking_price: action.data?.price,
      price_min: action.data?.priceMin,
      price_max: action.data?.priceMax,
      longitude: action.data?.gps?.longitude,
      latitude: action.data?.gps?.latitude,
      tags_input: action.data?.tags?.join(','),
      booking_style: action.data?.bookingStyle?.value,
    };
    for (let i = 0; i < action.data?.categories?.length; i++) {
      const item = action.data?.categories[i];
      params[`tax_input[listar_category][${i}]`] = item.id;
    }
    if (action.data?.openTime) {
      for (let i = 0; i < action.data?.openTime?.length; i++) {
        const item = action.data?.openTime[i];
        if (item.schedule) {
          for (let x = 0; x < item.schedule.length; x++) {
            const element = item.schedule[x];
            const d = item.dayOfWeek;
            params[`opening_hour[${d}][start][${x}]`] = element.start;
            params[`opening_hour[${d}][end][${x}]`] = element.end;
          }
        }
      }
    }
    for (let i = 0; i < action.data?.facilities?.length; i++) {
      const item = action.data?.facilities[i];
      params[`tax_input[listar_feature][${i}]`] = item.id;
    }
    if (action.data?.socials) {
      Object.entries(action.data?.socials).forEach(entry => {
        const [key, value] = entry;
        params[`social_network[${key}]`] = value;
      });
    }

    const response = yield Api.http.submitListing({
      params,
    });
    if (response.success) {
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
 * on request payment setting
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onRequestPayment(action: Action): Generator<any, void, any> {
  try {
    const response = yield Api.http.getPayment();
    if (response.success) {
      const payment = PaymentModel.fromJson(response.payment);
      action.callback?.(payment);
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

function* watchLoadList() {
  yield takeEvery(actionTypes.LOAD_LISTING, onLoadList);
}

function* watchLoadMore() {
  yield debounce(500, actionTypes.LOAD_MORE_LISTING, onLoadMore);
}

function* watchDetail() {
  yield takeEvery(actionTypes.LISTING_DETAIL, onLoadDetail);
}

function* watchLoadAuthorList() {
  yield takeEvery(actionTypes.LOAD_AUTHOR_LISTING, onLoadAuthorList);
}

function* watchDeletedItem() {
  yield takeEvery(actionTypes.DELETE_LISTING_ITEM, onDeleteItem);
}

function* watchInitSubmit() {
  yield takeEvery(actionTypes.INIT_SUBMIT_SETTING, onInitSubmit);
}

function* watchLoadTags() {
  yield takeEvery(actionTypes.LOAD_TAGS, onLoadTags);
}

function* watchSubmit() {
  yield takeEvery(actionTypes.SUBMIT, onSubmit);
}

function* watchPayment() {
  yield takeEvery(actionTypes.REQUEST_PAYMENT, onRequestPayment);
}

/**
 * on handle load my listings
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onLoadMyListings(action: Action): Generator<any, void, any> {
  try {
    const setting = yield select(settingSelect);

    let params: any = {
      page: action.params?.page || 1,
      per_page: setting?.perPage,
      s: action.params?.keyword,
    };

    if (action.filter) {
      const filter = yield action.filter.getParams();
      params = {
        ...params,
        ...filter,
      };
    }
    const response = yield Api.http.getMyListings({
      params,
    });

    if (response.success) {
      const data = response.data.map((item: any) => {
        return ProductModel.fromJson(item);
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

/**
 * on handle load pending listings (admin)
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onLoadPendingListings(action: Action): Generator<any, void, any> {
  try {
    const setting = yield select(settingSelect);

    let params: any = {
      page: action.params?.page || 1,
      per_page: setting?.perPage,
      s: action.params?.keyword,
    };

    if (action.filter) {
      const filter = yield action.filter.getParams();
      params = {
        ...params,
        ...filter,
      };
    }
    const response = yield Api.http.getPendingListings({
      params,
    });

    if (response.success) {
      const data = response.data.map((item: any) => {
        return ProductModel.fromJson(item);
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

/**
 * on update listing status (admin)
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onUpdateListingStatus(action: Action): Generator<any, void, any> {
  try {
    const response = yield Api.http.updateListingStatus(
      action.listingId,
      action.status,
    );

    if (response.success) {
      Api.navigator?.showToast({
        message: response.message || 'Status updated successfully',
        type: 'success',
      });
      action?.callback?.(true);
    } else {
      Api.navigator?.showToast({
        message: response.message ?? response.msg,
        type: 'warning',
      });
      action?.callback?.(false);
    }
  } catch (error: any) {
    Api.navigator?.showToast({
      message: error.message,
      type: 'warning',
    });
    action?.callback?.(false);
  }
}

function* watchMyListings() {
  yield takeEvery(actionTypes.LOAD_MY_LISTINGS, onLoadMyListings);
}

function* watchPendingListings() {
  yield takeEvery(actionTypes.LOAD_PENDING_LISTINGS, onLoadPendingListings);
}

function* watchUpdateListingStatus() {
  yield takeEvery(actionTypes.UPDATE_LISTING_STATUS, onUpdateListingStatus);
}

export default function* listingSagas() {
  yield all([
    watchLoadList(),
    watchLoadMore(),
    watchDetail(),
    watchLoadAuthorList(),
    watchDeletedItem(),
    watchInitSubmit(),
    watchSubmit(),
    watchLoadTags(),
    watchPayment(),
    watchMyListings(),
    watchPendingListings(),
    watchUpdateListingStatus(),
  ]);
}
