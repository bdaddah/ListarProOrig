import React, {useContext, useRef} from 'react';
import {
  ApplicationContext,
  Screen,
  ScreenContainerProps,
  Styles,
} from '@passionui/components';
import {WebView, WebViewNavigation} from 'react-native-webview';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

const Web: React.FC<ScreenContainerProps> = ({navigation, item}) => {
  const {navigator, theme} = useContext(ApplicationContext);
  const ref = useRef<WebView>(null);
  const result = useRef<string>();

  /**
   * handle state change
   */
  const onNavigationStateChange = (event: WebViewNavigation) => {
    if (!event.url) {
      return;
    }
    if (item.handlerUrl?.length > 0) {
      for (let i = 0; i < item?.handlerUrl?.length; i++) {
        const url = item?.handlerUrl[i];
        if (event.url.includes(url) && !result.current) {
          result.current = url;
          item.callbackUrl?.(url);
          if (item?.dismissOnHandle) {
            navigator?.pop();
          }
          if (item.clearCookie) {
            ref.current?.clearCache?.(true);
          }
        }
      }
    }
  };

  return (
    <Screen
      navigation={navigation}
      options={{
        title: item?.title,
      }}>
      <WebView
        ref={ref}
        style={Styles.flex}
        originWhitelist={['*']}
        startInLoadingState={true}
        source={{
          uri: item?.url,
        }}
        onNavigationStateChange={onNavigationStateChange}
        renderLoading={() => (
          <View style={[Styles.flexCenter, StyleSheet.absoluteFillObject]}>
            <ActivityIndicator
              color={theme.colors.primary.default}
              size="large"
            />
          </View>
        )}
      />
    </Screen>
  );
};

export {Web};
