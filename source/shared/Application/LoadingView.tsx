import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {CircleSnail} from 'react-native-progress';
import {BackHandler, StyleSheet, View} from 'react-native';
import {Colors, LoadingParams} from '../index';

export default forwardRef((_, ref) => {
  const timeout = useRef<NodeJS.Timeout | undefined>();
  const [visible, setVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    showLoading,
    hideLoading,
  }));

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        return visible;
      },
    );
    return () => {
      backHandler.remove();
    };
  }, [visible]);

  /**
   * show loading
   * @param loading
   */
  const showLoading = ({duration = 10000}: LoadingParams) => {
    setVisible(true);
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setVisible(false);
    }, duration);
  };

  /**
   * hidden loading
   */
  const hideLoading = () => {
    clearTimeout(timeout.current);
    setVisible(false);
  };

  if (visible) {
    return (
      <View style={styles.container}>
        <CircleSnail
          spinDuration={2000}
          indeterminate
          color={Colors.white}
          size={64}
        />
      </View>
    );
  }

  return null;
});

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000080',
  },
});
