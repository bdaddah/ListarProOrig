import React, {useContext, useEffect} from 'react';
import {ActivityIndicator, View} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {
  ApplicationContext,
  Colors,
  Image,
  Screen,
  ScreenContainerProps,
} from '@passionui/components';
import Assets from '@assets';
import styles from './styles';
import {applicationActions} from '@redux';
import Api from '@api';
import Main from '../../main';

const Splash: React.FC<ScreenContainerProps> = ({navigation}) => {
  const {theme} = useContext(ApplicationContext);

  useEffect(() => {
    SplashScreen.hide();
    applicationActions.onStart(() => {
      Api.navigator?.replace({screen: Main});
    });
  }, []);

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
