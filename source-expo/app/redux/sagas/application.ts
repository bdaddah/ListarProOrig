import {all, delay, put, select, takeEvery} from 'redux-saga/effects';
import {actionTypes, domainSelect, settingSelect} from '@redux';
import Api from '@api';
import {Settings} from '@configs';
import {Action, DeviceModel, SettingModel} from '@models+types';
import {isValidURL} from '@utils';

/**
 * task for start application
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onStartApplication(action: Action): Generator<any, void, any> {
  const domain = yield select(domainSelect);
  let setting = yield select(settingSelect);
  yield all([
    yield put({type: actionTypes.SYNC_DEVICE_INFO}),
    yield put({
      type: actionTypes.SAVE_DOMAIN,
      domain: domain ?? Settings.domain,
    }),
  ]);

  const response = yield Api.http.getSetting();
  if (response.success) {
    setting = SettingModel.fromJson(response.data);
    yield put({type: actionTypes.SAVE_SETTING, setting});
  } else {
    Api.navigator?.showToast({
      message: response.message ?? response.msg,
      type: 'warning',
    });
  }

  action.callback?.();

  yield put({type: actionTypes.AUTH_CHECK});
  yield put({type: actionTypes.LOAD_DISCOVERY});
  yield put({type: actionTypes.LOAD_BLOG});
}

/**
 * sync device info
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onDeviceSync(action: Action): Generator<any, void, any> {
  const device = yield DeviceModel.fromDeviceInfo();
  if (action?.token) {
    device.token = action.token;
  }
  yield put({type: actionTypes.SAVE_DEVICE_INFO, device});
}

/**
 * change domain
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onChangeDomain(action: Action): Generator<any, void, any> {
  try {
    const valid = isValidURL(action.domain);
    if (valid) {
      yield put({type: actionTypes.CLEAR_REDUCER});
      yield put({
        type: actionTypes.SAVE_DOMAIN,
        domain: action.domain,
      });
      yield delay(300);
      Api.navigator?.showToast({
        message: 'save_data_success',
        type: 'success',
      });
      action?.callback?.();
    }
  } catch (error: any) {
    Api.navigator?.showToast({
      message: error.message,
      type: 'warning',
    });
  }
}

function* watchStartApplication() {
  yield takeEvery(actionTypes.START_APPLICATION, onStartApplication);
}

function* watchSyncDeviceInfo() {
  yield takeEvery(actionTypes.SYNC_DEVICE_INFO, onDeviceSync);
}

function* watchChangeDomain() {
  yield takeEvery(actionTypes.CHANGE_DOMAIN, onChangeDomain);
}

export default function* applicationSagas() {
  yield all([
    watchStartApplication(),
    watchSyncDeviceInfo(),
    watchChangeDomain(),
  ]);
}
