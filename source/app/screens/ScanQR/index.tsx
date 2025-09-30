import React, {useContext, useEffect, useRef, useState} from 'react';

import {Linking, Platform, StyleSheet, View} from 'react-native';
import {PERMISSIONS, request} from 'react-native-permissions';
import {Camera, CameraType} from 'react-native-camera-kit';
import {
  ApplicationContext,
  Colors,
  IconButton,
  Screen,
  ScreenContainerProps,
  Styles,
} from '@passionui/components';
import styles from './styles';

const ScanQR: React.FC<ScreenContainerProps> = ({navigation}) => {
  const {theme, navigator, translate} = useContext(ApplicationContext);
  const data = useRef();
  const camera = useRef<any>();
  const [flashMode, setFlashMode] = useState(false);
  const [permission, setPermission] = useState('unavailable');

  useEffect(() => {
    const requestPermission = async () => {
      const type = Platform.select({
        ios: PERMISSIONS.IOS.CAMERA,
        android: PERMISSIONS.ANDROID.CAMERA,
      });
      const result = await request(type!);
      if (result) {
        setPermission(result);
      }
    };
    requestPermission().then();
  }, []);

  /**
   * handle read qrcode
   * @param data
   */
  const onBarCodeRead = async ({nativeEvent}: any) => {
    if (data.current) {
      return;
    }
    data.current = nativeEvent?.codeStringValue;
    try {
      navigator?.pop();
      await Linking.openURL(nativeEvent?.codeStringValue);
    } catch (error: any) {
      navigator?.showToast({
        message: error.message,
        type: 'warning',
      });
    }
  };

  return (
    <Screen
      navigation={navigation}
      options={{
        title: translate('scan_qrcode'),
        headerBackground: undefined,
        headerTransparent: true,
        headerTintColor: Colors.white,
      }}>
      {permission === 'granted' && (
        <Camera
          style={Styles.flex}
          ref={camera}
          cameraType={CameraType.Back}
          onReadCode={onBarCodeRead}
          scanBarcode={!!onBarCodeRead}
          flashMode={flashMode ? 'on' : 'off'}
        />
      )}
      <View style={[StyleSheet.absoluteFill, Styles.columnCenter]}>
        <View style={styles.qrContent}>
          <View style={[Styles.rowSpace]}>
            <View
              style={[
                styles.topLeft,
                {borderColor: theme.colors.primary.default},
              ]}
            />
            <View
              style={[
                styles.topRight,
                {borderColor: theme.colors.primary.default},
              ]}
            />
          </View>
          <View style={Styles.flex} />
          <View style={Styles.rowSpace}>
            <View
              style={[
                styles.bottomLeft,
                {borderColor: theme.colors.primary.default},
              ]}
            />
            <View
              style={[
                styles.bottomRight,
                {borderColor: theme.colors.primary.default},
              ]}
            />
          </View>
        </View>

        <View style={styles.bottomCenter}>
          <IconButton
            icon={flashMode ? 'flashlight' : 'flashlight-off'}
            onPress={() => setFlashMode(!flashMode)}
            style={{backgroundColor: Colors.modal}}
          />
        </View>
      </View>
    </Screen>
  );
};

export {ScanQR};
