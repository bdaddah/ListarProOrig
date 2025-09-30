import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {Shadow, SizedBox, Spacing, Toast, ToastParams} from '../index';

export default forwardRef((_, ref) => {
  const toasts = useRef<any>([]);
  const [update, setUpdate] = useState<number>();

  useImperativeHandle(ref, () => ({
    showToast,
    hideToast,
  }));

  /**
   * show loading
   * @param item
   */
  const showToast = (item: ToastParams) => {
    const key = Date.now();
    const timeout = setTimeout(() => {
      item.onDismiss?.();
      toasts.current = toasts.current.filter((data: any) => data.key !== key);
      setUpdate(Date.now());
    }, item.duration ?? 2000);
    const element = {item, job: timeout, key};
    toasts.current.push(element);
    setUpdate(Date.now());
  };

  /**
   * on dismiss a toast
   */
  const onDismiss = (element: any) => {
    clearTimeout(element.job);
    element.item.onDismiss?.();
    toasts.current = toasts.current.filter(
      (data: any) => data.key !== element.key,
    );
    setUpdate(Date.now());
  };

  /**
   *hidden loading
   */
  const hideToast = () => {
    toasts.current = [];
    setUpdate(Date.now());
  };

  if (toasts.current.length > 0) {
    return (
      <View style={[styles.container, Shadow.dark]} key={`Toast${update}`}>
        {toasts.current.map((data: any, index: number) => {
          return (
            <View key={`Toast${index}`}>
              {index !== 0 && <SizedBox height={Spacing.S} />}
              <Toast
                {...data.item}
                action={{
                  ...data.item.action,
                  onPress: () => {
                    data.item.action?.onPress?.();
                    onDismiss(data);
                  },
                }}
              />
            </View>
          );
        })}
      </View>
    );
  }
  return null;
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    padding: Spacing.M,
    bottom: 80,
  },
});
