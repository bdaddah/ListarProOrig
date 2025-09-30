import {DeviceEventEmitter} from 'react-native';
import React, {useContext, useEffect, useMemo, useRef} from 'react';
import {
  ApplicationContext,
  BottomTab,
  BottomTabItemProps,
  Localization,
  NavigationContainer,
  Navigator,
  ScreenContainerProps,
} from '@passionui/components';
import {Components, StylesGuide} from './screens';
import Motions from './screens/Motions';
import {DATA} from './screens/Components';
import Assets from '@assets';
import {useSelector} from 'react-redux';
import {languageSelect} from '@redux';

const Main: React.FC<ScreenContainerProps> = ({navigation}) => {
  const tabs: BottomTabItemProps[] = [
    {
      name: 'Styles',
      title: 'Styles Guide',
      options: {
        title: 'Styles Guide',
      },
      icon: 'palette-swatch-outline',
      screen: StylesGuide,
      initialParams: {a: 'hello'},
    },
    {
      name: 'Components',
      title: 'Components',
      options: {
        title: 'Components',
      },
      icon: 'shape-outline',
      tabBarBadge: DATA.length,
      screen: Components,
    },
    {
      name: 'Motions',
      title: 'Motions',
      options: {
        title: 'Motions',
      },
      icon: 'transition',
      screen: Motions,
    },
  ];

  return <BottomTab tabs={tabs} navigation={navigation} />;
};

const App: React.FC<ScreenContainerProps> = ({navigation}) => {
  const language = useSelector(languageSelect);

  useEffect(() => {
    navigation?.setOptions({headerShown: false, headerBackground: undefined});
    const subscription = DeviceEventEmitter?.addListener('dismiss', () => {
      navigation?.pop();
    });
    return () => subscription?.remove();
  }, [navigation]);

  const {theme} = useContext(ApplicationContext);
  const navigator = new Navigator({
    ref: useRef(),
    loadingRef: useRef(),
    toastRef: useRef(),
  });

  const localization = useMemo(() => {
    return new Localization({resources: Assets.language, lng: language});
  }, [language]);

  return (
    <NavigationContainer
      navigator={navigator}
      theme={theme}
      screen={Main}
      localization={localization}
    />
  );
};

export default App;
