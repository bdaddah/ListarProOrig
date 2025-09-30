import {all, delay, put, select, takeEvery} from 'redux-saga/effects';
import Api from '@api';
import messaging from '@react-native-firebase/messaging';
import {actionTypes, userSelect} from '@redux';
import {Action, UserModel} from '@models+types';

/**
 * task for start application
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onAuthCheck(action: Action): Generator<any, void, any> {
  try {
    const user = yield select(userSelect);
    if (user?.token) {
      const response = yield Api.http.validateToken();
      if (response.code === 'jwt_auth_valid_token') {
        yield put({type: actionTypes.FETCH_USER});
        yield put({type: actionTypes.LOAD_WISHLIST});
      }
    }
    action.callback?.();
  } catch (error: any) {
    Api.navigator?.showToast({
      message: error?.response?.data?.message ?? error?.message,
      type: 'warning',
    });
  }
}

/**
 * on handle login
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onLogin(action: Action): Generator<any, void, any> {
  try {
    Api.navigator?.showLoading();
    const authStatus = yield messaging().requestPermission();
    const permissions = [
      messaging.AuthorizationStatus.AUTHORIZED,
      messaging.AuthorizationStatus.PROVISIONAL,
    ];
    const enabled = permissions.includes(authStatus);
    if (enabled && !__DEV__) {
      const token = yield messaging().getToken();
      if (token) {
        yield put({type: actionTypes.SYNC_DEVICE_INFO, token});
        yield delay(200);
      }
    }

    const response = yield Api.http.login({params: action.params});
    if (response.success) {
      const user = UserModel.fromJson(response.data);
      yield put({type: actionTypes.SAVE_USER, user});
      yield put({type: actionTypes.LOAD_WISHLIST});
    } else {
      Api.navigator?.showToast({
        message: response.message ?? response.msg,
        type: 'default',
      });
    }
    action.callback?.({
      success: response.success,
      code: response.code,
      email: response.data?.email,
    });
  } catch (error: any) {
    action.callback?.({
      success: false,
      code: error.response?.data?.code,
      email: error.response?.data?.email,
    });
    Api.navigator?.showToast({
      message: error?.response?.data?.message ?? error?.message,
      type: 'warning',
    });
  }
}

/**
 * handle register
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onRegister(action: Action): Generator<any, void, any> {
  try {
    const response = yield Api.http.register({params: action.params});
    const success = response.data?.status === 200 || response.code === 200;
    Api.navigator?.showToast({
      message: response.message ?? response.msg,
      type: success ? 'success' : 'default',
    });
    if (success) {
      action.callback?.();
    }
  } catch (error: any) {
    Api.navigator?.showToast({
      message: error?.response?.data?.message ?? error?.message,
      type: 'warning',
    });
  }
}

/**
 * handle forgot password
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onForgot(action: Action): Generator<any, void, any> {
  try {
    const response = yield Api.http.forgotPassword({params: action.params});
    Api.navigator?.showToast({
      message: response.message ?? response.msg,
      type: response.success ? 'success' : 'default',
    });
    action.callback?.({success: response.success, code: response.code});
  } catch (error: any) {
    action.callback?.({success: false, code: error.response?.data?.code});
    Api.navigator?.showToast({
      message: error.response?.data?.message ?? error.message,
      type: 'warning',
    });
  }
}

/**
 * handle edit profile
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onEditProfile(action: Action): Generator<any, void, any> {
  try {
    const response = yield Api.http.editProfile({params: action.params});
    const success = !response.code;
    if (success) {
      yield put({type: actionTypes.FETCH_USER});
      action.callback?.();
    }
    Api.navigator?.showToast({
      message: response.code ?? 'save_data_success',
      type: success ? 'success' : 'default',
    });
  } catch (error: any) {
    Api.navigator?.showToast({
      message: error.message,
      type: 'warning',
    });
  }
}

/**
 * handle fetch user data
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onFetchUser(action: Action): Generator<any, void, any> {
  try {
    const response = yield Api.http.getUser({params: action.params});
    if (response.success) {
      const user = UserModel.fromJson(response.data);
      const existUser = yield select(userSelect);
      user!.token = existUser?.token;
      yield put({type: actionTypes.SAVE_USER, user: user});
      action.callback?.();
    } else {
      Api.navigator?.showToast({
        message: response.message ?? response.msg,
        type: 'default',
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
 * handle change password
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onChangePassword(action: Action): Generator<any, void, any> {
  try {
    const response = yield Api.http.changePassword({params: action.params});
    const success = !response.code;
    if (success) {
      action.callback?.();
    }
    Api.navigator?.showToast({
      message: response.code ?? 'save_data_success',
      type: success ? 'success' : 'default',
    });
  } catch (error: any) {
    Api.navigator?.showToast({
      message: error.message,
      type: 'warning',
    });
  }
}

/**
 * handle request otp
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onRequestOTP(action: Action): Generator<any, void, any> {
  try {
    const response = yield Api.http.requestOTP({params: action.params});
    if (response.success) {
      action.callback?.(response.data?.exp_time);
    }
    Api.navigator?.showToast({
      message: response.msg ?? response.message ?? response.data,
      type: response.success ? 'success' : 'default',
    });
  } catch (error: any) {
    Api.navigator?.showToast({
      message: error.message,
      type: 'warning',
    });
  }
}

/**
 * handle deactivate account
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* onDeactivate(action: Action): Generator<any, void, any> {
  try {
    const response = yield Api.http.deactivateAccount({params: action.params});
    yield put({type: actionTypes.LOGOUT});
    Api.navigator?.showToast({
      message: response.message,
      type: response.success ? 'success' : 'default',
    });
  } catch (error: any) {
    Api.navigator?.showToast({
      message: error.message,
      type: 'warning',
    });
  }
}

function* watchAuthCheck() {
  yield takeEvery(actionTypes.AUTH_CHECK, onAuthCheck);
}

function* watchLogin() {
  yield takeEvery(actionTypes.LOGIN, onLogin);
}

function* watchRegister() {
  yield takeEvery(actionTypes.REGISTER, onRegister);
}

function* watchForgot() {
  yield takeEvery(actionTypes.FORGOT, onForgot);
}

function* watchEditProfile() {
  yield takeEvery(actionTypes.EDIT_PROFILE, onEditProfile);
}

function* watchFetchUser() {
  yield takeEvery(actionTypes.FETCH_USER, onFetchUser);
}

function* watchChangePassword() {
  yield takeEvery(actionTypes.CHANGE_PASSWORD, onChangePassword);
}

function* watchOTP() {
  yield takeEvery(actionTypes.REQUEST_EMAIL_OTP, onRequestOTP);
}

function* watchDeactivate() {
  yield takeEvery(actionTypes.DEACTIVATE, onDeactivate);
}

export default function* authSagas() {
  yield all([
    watchLogin(),
    watchAuthCheck(),
    watchForgot(),
    watchRegister(),
    watchEditProfile(),
    watchFetchUser(),
    watchChangePassword(),
    watchOTP(),
    watchDeactivate(),
  ]);
}
