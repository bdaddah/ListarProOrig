import {actionTypes, store} from '@redux';

export const onLogin = (
  params: any,
  callback: (success: boolean, code: string) => void,
) => {
  return store.dispatch({
    type: actionTypes.LOGIN,
    params,
    callback,
  });
};

export const onRegister = (params: any, callback = () => {}) => {
  return store.dispatch({
    type: actionTypes.REGISTER,
    params,
    callback,
  });
};

export const onForgot = (
  params: any,
  callback: (success: boolean, code: string) => void,
) => {
  return store.dispatch({
    type: actionTypes.FORGOT,
    params,
    callback,
  });
};

export const onLogout = () => {
  return store.dispatch({
    type: actionTypes.LOGOUT,
  });
};

export const onDeactivate = () => {
  return store.dispatch({
    type: actionTypes.DEACTIVATE,
  });
};

export const onEditProfile = (params: any, callback = () => {}) => {
  return store.dispatch({
    type: actionTypes.EDIT_PROFILE,
    params,
    callback,
  });
};

export const onChangePassword = (params: any, callback = () => {}) => {
  return store.dispatch({
    type: actionTypes.CHANGE_PASSWORD,
    params,
    callback,
  });
};

export const onRequestOTP = (params: any, callback: (time: number) => void) => {
  return store.dispatch({
    type: actionTypes.REQUEST_EMAIL_OTP,
    params,
    callback,
  });
};
