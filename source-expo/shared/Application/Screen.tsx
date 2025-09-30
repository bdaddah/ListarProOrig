import {
  Animated,
  KeyboardAvoidingView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {useHeaderHeight} from '@react-navigation/elements';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import React, {
  forwardRef,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';

import {
  ApplicationContext,
  Colors,
  HeaderBackground,
  HeaderTitle,
  HeaderType,
  Image,
  ScreenProps,
  SizedBox,
  Spacing,
  Styles,
} from '../index';
import {LinearGradient} from 'expo-linear-gradient';

const Screen = forwardRef(
    (
        {
          children,
          enableKeyboardAvoidingView = false,
          scrollable = false,
          navigation,
          options,
          headerType = 'surface',
          animatedHeader,
          scrollViewProps,
          headerComponent: Header,
          footerComponent: Footer,
          floatingComponent: Floating,
          layoutOffset = -8,
          edges = [],
          backgroundColor,
          animatedValue: screenAnimatedValue,
          style,
        }: ScreenProps,
        ref,
    ) => {
      const animatedValue = useRef(screenAnimatedValue ?? new Animated.Value(0));
      const {theme} = useContext(ApplicationContext);
      const dimensions = useWindowDimensions();
      const insets = useSafeAreaInsets();
      const heightHeader = useHeaderHeight();
      const currentTint = useRef(Colors.white);
      const bannerHeight = Math.min(dimensions.height * 0.35, 240);
      const bgColor = backgroundColor ?? theme.colors.background.default;
      let handleScroll;
      let Component: any = View;
      let keyboardVerticalOffset = heightHeader - 20;

      /**
       * process option headerStyle & header animated
       */
      const screenOptions = useMemo(() => {
        let navigationOptions: NativeStackNavigationOptions;

        if (animatedHeader) {
          navigationOptions = {
            headerShown: true,
            headerTransparent: true,
            headerTitleAlign: 'center',
            headerTintColor: Colors.white,
            headerBackground: () => (
                <HeaderBackground
                    animatedValue={animatedValue.current}
                    surface={animatedHeader.type === 'surface'}
                />
            ),
            headerTitle: (props: any) => (
                <HeaderTitle {...props} animatedValue={animatedValue.current} />
            ),
          };
        } else if (headerType === 'extended') {
          navigationOptions = {
            headerShown: true,
            headerTransparent: true,
            headerBackground: undefined,
            headerTitleAlign: 'center',
            headerTintColor: theme.colors.text.default,
          };
        } else if (headerType === 'surface') {
          navigationOptions = {
            headerShown: true,
            headerTransparent: false,
            headerBackground: () => <HeaderBackground surface={true} />,
            headerTitleAlign: 'center',
            headerTintColor: theme.colors.text.default,
          };
        } else if (headerType === 'none') {
          navigationOptions = {
            headerShown: false,
            headerTransparent: true,
            headerBackground: undefined,
          };
        } else {
          navigationOptions = {
            headerShown: true,
            headerTransparent: false,
            headerBackground: () => <HeaderBackground />,
            headerTitleAlign: 'center',
            headerTintColor: theme.colors.text.default,
          };
        }

        return navigationOptions;
      }, [animatedHeader, headerType, theme.colors.text.default]);

      if (screenOptions.headerTransparent) {
        keyboardVerticalOffset = -20;
      }

      /**
       * animated when use scroll && animated value
       */
      if (scrollable) {
        Component = Animated.ScrollView;
        handleScroll = scrollViewProps?.onScroll;
        if (animatedHeader) {
          handleScroll = Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {y: animatedValue.current as Animated.Value},
                  },
                },
              ],
              {
                useNativeDriver: true,
                listener: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
                  const offsetY = e.nativeEvent.contentOffset.y;
                  let color = Colors.white;
                  if (offsetY > 50) {
                    color = theme.colors.text.default;
                  }
                  if (color !== currentTint.current) {
                    currentTint.current = color;
                    navigation?.setOptions({
                      headerTintColor: color,
                    });
                    const lightStyle = color === Colors.white || theme.dark;
                    navigation?.setOptions({
                      statusBarStyle: lightStyle ? 'light' : 'dark',
                    });
                  }
                  scrollViewProps?.onScroll?.(e);
                },
              },
          );
        }
      }

      /**
       * handle set bar style for screen
       */
      useLayoutEffect(() => {
        navigation?.setOptions({statusBarStyle: theme.dark ? 'light' : 'dark'});
      }, [navigation, theme.dark]);

      /**
       * handle set options for screen
       */
      useLayoutEffect(() => {
        navigation?.setOptions({...screenOptions, ...options});
      }, [navigation, options, screenOptions]);

      /**
       * render top navigation banner
       */
      const renderBannerHeader = () => {
        if (typeof animatedHeader?.component === 'function') {
          return (
              <View
                  style={[
                    styles.screenBanner,
                    {maxHeight: bannerHeight + layoutOffset},
                  ]}>
                {animatedHeader?.component({
                  animatedValue: animatedValue.current,
                })}
              </View>
          );
        }
      };

      return (
          <SafeAreaView
              edges={edges}
              style={[Styles.flex, {backgroundColor: bgColor}]}>
            <HeaderExtendHeader
                headerType={headerType}
                heightHeader={heightHeader}
                backgroundColor={bgColor}
            />

            <KeyboardAvoidingView
                style={Styles.flex}
                enabled={enableKeyboardAvoidingView}
                keyboardVerticalOffset={keyboardVerticalOffset}
                behavior={Platform.select({
                  ios: 'padding',
                  android: 'height',
                })}>
              {Header}

              <Component
                  {...(scrollViewProps && {
                    keyboardShouldPersistTaps: 'handled',
                    ...scrollViewProps,
                  })}
                  style={[Styles.flex, style]}
                  ref={ref}
                  onScroll={handleScroll}>
                {renderBannerHeader()}

                {children}
              </Component>

              {Floating && <View style={styles.floatingContainer}>{Floating}</View>}

              {Footer && (
                  <View
                      style={[
                        styles.footerContainer,
                        {
                          paddingBottom: Math.min(insets.bottom, 20) + Spacing.S,
                          backgroundColor: theme.colors.background.surface,
                        },
                      ]}>
                    {Footer}
                  </View>
              )}
            </KeyboardAvoidingView>
          </SafeAreaView>
      );
    },
);

/**
 * Header extended with background image
 * @constructor
 */
const HeaderExtendHeader: React.FC<{
  headerType?: HeaderType;
  heightHeader: number;
  backgroundColor: string;
}> = ({headerType = 'default', heightHeader, backgroundColor}) => {
  const {theme} = useContext(ApplicationContext);

  if (headerType === 'extended') {
    return (
        <>
          <SizedBox height={heightHeader} />
          <LinearGradient
              colors={[theme.colors.primary.light, backgroundColor]}
              style={[styles.extendedHeader, styles.headerImage]}>
            {theme.assets?.headerBackground && (
                <Image
                    source={theme.assets?.headerBackground}
                    style={Styles.flex}
                    loading={false}
                />
            )}
          </LinearGradient>
        </>
    );
  }

  return <View />;
};

const styles = StyleSheet.create({
  screenBanner: {
    width: '100%',
  },
  headerImage: {width: '100%', height: 154},
  extendedHeader: {
    position: 'absolute',
    width: '100%',
  },
  footerContainer: {
    paddingTop: Spacing.S,
    paddingHorizontal: Spacing.M,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black_10,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 1,
        shadowRadius: 4,
      },
      android: {
        shadowOpacity: 1,
        elevation: 4,
      },
    }),
  },
  floatingContainer: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    shadowColor: Colors.black_10,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 6,
  },
});
export default Screen;
