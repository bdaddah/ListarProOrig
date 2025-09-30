import React, {useContext, useEffect, useRef, useState} from 'react';

import {Linking, StyleSheet, View} from 'react-native';
import {CameraView, useCameraPermissions} from 'expo-camera';
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
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission().then();
    }
  }, [permission?.granted, requestPermission]);

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
      {permission?.granted && (
        <CameraView
          style={Styles.flex}
          ref={camera}
          facing={'back'}
          onBarcodeScanned={onBarCodeRead}
          flash={flashMode ? 'on' : 'off'}
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
