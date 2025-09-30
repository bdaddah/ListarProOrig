import {CommonActions, StackActions} from '@react-navigation/native';
import {
  BottomSheetParams,
  LoadingParams,
  ModalParams,
  ScreenParams,
  ToastParams,
} from './types';
import React from 'react';

class Navigator {
  ref?: any;
  loadingRef?: any;
  toastRef?: any;

  constructor(data: {
    ref: React.MutableRefObject<any>;
    loadingRef: React.MutableRefObject<any>;
    toastRef: React.MutableRefObject<any>;
  }) {
    this.ref = data.ref;
    this.loadingRef = data.loadingRef;
    this.toastRef = data.toastRef;
  }

  push = (params: ScreenParams<any>) => {
    if (this.ref.current?.isReady()) {
      this.ref.current?.dispatch(StackActions.push('Stack', params));
    }
  };

  replace = (params: ScreenParams<any>) => {
    if (this.ref.current?.isReady()) {
      this.ref.current?.dispatch(StackActions.replace('Stack', params));
    }
  };

  reset = (params: ScreenParams<any>) => {
    if (this.ref.current?.isReady()) {
      this.ref.current?.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'Stack',
              key: `Stack_${new Date().getTime()}`,
              params,
            },
          ],
        }),
      );
    }
  };

  pop = (count?: number) => {
    if (this.ref.current?.isReady()) {
      this.ref.current?.dispatch(StackActions.pop(count ?? 1));
    }
  };

  present = (params: ScreenParams<any>) => {
    if (this.ref.current?.isReady()) {
      this.ref.current?.dispatch(StackActions.push('Dialog', params));
    }
  };

  showModal = (params: ModalParams) => {
    if (this.ref.current?.isReady()) {
      this.ref.current?.dispatch(StackActions.push('Modal', params));
    }
  };

  showBottomSheet = (params: BottomSheetParams) => {
    if (this.ref.current?.isReady()) {
      this.ref.current?.dispatch(
        StackActions.push('Modal', {
          ...params,
          isBottomSheet: true,
        }),
      );
    }
  };

  popToTop = () => {
    if (this.ref.current?.isReady()) {
      this.ref.current?.dispatch(StackActions.popToTop());
    }
  };

  showLoading = (params?: LoadingParams) => {
    this.loadingRef.current?.showLoading(params ?? {});
  };

  hideLoading = () => {
    this.loadingRef.current?.hideLoading();
  };

  showToast = (params: ToastParams) => {
    this.toastRef.current?.showToast(params);
  };

  hideToast = () => {
    this.toastRef.current?.hideToast();
  };
}

export default Navigator;
