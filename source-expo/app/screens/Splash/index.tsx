import React, {useContext, useEffect} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {useFonts} from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {
  ApplicationContext,
  Colors,
  Image,
  Screen,
  ScreenContainerProps,
} from '@passionui/components';
import Assets from '@assets';
import styles from './styles';

const Splash: React.FC<ScreenContainerProps> = ({navigation}) => {
  const {theme} = useContext(ApplicationContext);
  const [loaded, error] = useFonts({
    'Raleway-Black': require('../../assets/fonts/Raleway-Black.ttf'),
    'Raleway-BlackItalic': require('../../assets/fonts/Raleway-BlackItalic.ttf'),
    'Raleway-Bold': require('../../assets/fonts/Raleway-Bold.ttf'),
    'Raleway-BoldItalic': require('../../assets/fonts/Raleway-BoldItalic.ttf'),
    'Raleway-ExtraBold': require('../../assets/fonts/Raleway-ExtraBold.ttf'),
    'Raleway-ExtraBoldItalic': require('../../assets/fonts/Raleway-ExtraBoldItalic.ttf'),
    'Raleway-ExtraLight': require('../../assets/fonts/Raleway-ExtraLight.ttf'),
    'Raleway-ExtraLightItalic': require('../../assets/fonts/Raleway-ExtraLightItalic.ttf'),
    'Raleway-Italic': require('../../assets/fonts/Raleway-Italic.ttf'),
    'Raleway-Light': require('../../assets/fonts/Raleway-Light.ttf'),
    'Raleway-LightItalic': require('../../assets/fonts/Raleway-LightItalic.ttf'),
    'Raleway-Medium': require('../../assets/fonts/Raleway-Medium.ttf'),
    'Raleway-MediumItalic': require('../../assets/fonts/Raleway-MediumItalic.ttf'),
    'Raleway-Regular': require('../../assets/fonts/Raleway-Regular.ttf'),
    'Raleway-SemiBold': require('../../assets/fonts/Raleway-SemiBold.ttf'),
    'Raleway-SemiBoldItalic': require('../../assets/fonts/Raleway-SemiBoldItalic.ttf'),
    'Raleway-Thin': require('../../assets/fonts/Raleway-Thin.ttf'),
    'Raleway-ThinItalic': require('../../assets/fonts/Raleway-ThinItalic.ttf'),
    'SFProText-Black': require('../../assets/fonts/SFProText-Black.ttf'),
    'SFProText-Bold': require('../../assets/fonts/SFProText-Bold.ttf'),
    'SFProText-Heavy': require('../../assets/fonts/SFProText-Heavy.ttf'),
    'SFProText-Light': require('../../assets/fonts/SFProText-Light.ttf'),
    'SFProText-Medium': require('../../assets/fonts/SFProText-Medium.ttf'),
    'SFProText-Regular': require('../../assets/fonts/SFProText-Regular.ttf'),
    'SFProText-Semibold': require('../../assets/fonts/SFProText-Semibold.ttf'),
    'SFProText-Thin': require('../../assets/fonts/SFProText-Thin.ttf'),
    'SFProText-Ultralight': require('../../assets/fonts/SFProText-Ultralight.ttf'),
    'Poppins-Black': require('../../assets/fonts/Poppins-Black.ttf'),
    'Poppins-BlackItalic': require('../../assets/fonts/Poppins-BlackItalic.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-BoldItalic': require('../../assets/fonts/Poppins-BoldItalic.ttf'),
    'Poppins-ExtraBold': require('../../assets/fonts/Poppins-ExtraBold.ttf'),
    'Poppins-ExtraBoldItalic': require('../../assets/fonts/Poppins-ExtraBoldItalic.ttf'),
    'Poppins-ExtraLight': require('../../assets/fonts/Poppins-ExtraLight.ttf'),
    'Poppins-ExtraLightItalic': require('../../assets/fonts/Poppins-ExtraLightItalic.ttf'),
    'Poppins-Italic': require('../../assets/fonts/Poppins-Italic.ttf'),
    'Poppins-Light': require('../../assets/fonts/Poppins-Light.ttf'),
    'Poppins-LightItalic': require('../../assets/fonts/Poppins-LightItalic.ttf'),
    'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-MediumItalic': require('../../assets/fonts/Poppins-MediumItalic.ttf'),
    'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('../../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-SemiBoldItalic': require('../../assets/fonts/Poppins-SemiBoldItalic.ttf'),
    'Poppins-Thin': require('../../assets/fonts/Poppins-Thin.ttf'),
    'Poppins-ThinItalic': require('../../assets/fonts/Poppins-ThinItalic.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync().then();
    }
  }, [loaded, error]);

  return (
    <Screen
      headerType={'none'}
      navigation={navigation}
      style={[
        styles.container,
        {backgroundColor: theme.colors.primary.default},
      ]}>
      <View style={styles.contentLogo}>
        <View style={styles.logo}>
          <Image
            source={Assets.image.logo}
            resizeMode="contain"
            style={styles.container}
          />
          <ActivityIndicator
            size="large"
            color={Colors.white}
            style={styles.loading}
          />
        </View>
      </View>
    </Screen>
  );
};

export {Splash};
