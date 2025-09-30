import React, {useMemo, useRef} from 'react';

import {useColorScheme} from 'react-native';
import {Settings} from '@configs';
import {
  defaultDarkTheme,
  defaultTheme,
  Localization,
  NavigationContainer,
  Navigator,
} from '@passionui/components';
import {Splash} from '@screens';
import Api from '@api';
import {useSelector} from 'react-redux';
import {
  appearanceSelect,
  fontSelect,
  languageSelect,
  themeSelect,
} from '@redux';
import {buildColorSchema} from '@utils';
import Assets from '@assets';

export default function Container() {
  Api.navigator = useRef(
    new Navigator({
      ref: useRef(),
      loadingRef: useRef(),
      toastRef: useRef(),
    }),
  ).current;

  const isDark = useColorScheme() === 'dark';
  const font = useSelector(fontSelect);
  const theme = useSelector(themeSelect);
  const appearance = useSelector(appearanceSelect);
  const language = useSelector(languageSelect);

  const themeData = useMemo(() => {
    let data = isDark ? defaultDarkTheme : defaultTheme;
    if (appearance === 'always_on') {
      data = defaultDarkTheme;
    } else if (appearance === 'always_off') {
      data = defaultTheme;
    }

    const current = theme ?? Settings.defaultTheme;

    data = {
      ...data,
      colors: {
        ...data.colors,
        primary: buildColorSchema(current.primary),
        secondary: buildColorSchema(current.secondary),
      },
    };

    return {...data, font: font ?? defaultTheme.font};
  }, [font, theme, appearance, isDark]);

  const localization = useMemo(() => {
    return new Localization({
      resources: Assets.language,
      lng: language,
      fallbackLng: Settings.defaultLanguage,
    });
  }, [language]);

  return (
    <NavigationContainer
      screen={Splash}
      theme={themeData}
      navigator={Api.navigator}
      localization={localization}
    />
  );
}
