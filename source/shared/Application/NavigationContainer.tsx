import React from 'react';
import {I18nextProvider} from 'react-i18next';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer as ReactNavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import StackScreen from './StackScreen';
import DialogScreen from './DialogScreen';
import ModalScreen from './ModalScreen';
import {
  ApplicationContext,
  Colors,
  HeaderBackground,
  HeaderTitle,
  NavigationBackButton,
  NavigationContainerProps,
  RootStackParamList,
  Styles,
} from '../index';
import LoadingView from './LoadingView';
import ToastView from './ToastView';

const Stack = createNativeStackNavigator<RootStackParamList>();

const NavigationContainer: React.FC<NavigationContainerProps> = ({
  screen,
  theme,
  navigator,
  params,
  localization,
}) => {
  return (
    <GestureHandlerRootView style={Styles.flex}>
      <SafeAreaProvider style={Styles.flex}>
        <I18nextProvider i18n={localization.instance} defaultNS={'translation'}>
          <ApplicationContext.Provider
            value={{theme, navigator, translate: localization.instance.t}}>
            <BottomSheetModalProvider>
              <ReactNavigationContainer
                theme={{
                  dark: theme.dark,
                  colors: {
                    primary: theme.colors.primary.default,
                    background: theme.colors.background.default,
                    card: theme.colors.background.surface,
                    text: theme.colors.text.default,
                    border: theme.colors.border.default,
                    notification: theme.colors.error.default,
                  },
                }}
                ref={navigator?.ref}
                independent={true}>
                <Stack.Navigator
                  initialRouteName="Stack"
                  screenOptions={{
                    headerBackTitleVisible: false,
                    headerTitleAlign: 'center',
                    statusBarTranslucent: true,
                    statusBarColor: 'transparent',
                    headerTintColor: theme.colors.text.default,
                    headerShadowVisible: false,
                    headerLargeTitleShadowVisible: false,
                    headerStyle: {},
                  }}>
                  <Stack.Screen
                    name="Stack"
                    component={StackScreen}
                    initialParams={{...params, screen}}
                    options={{
                      gestureEnabled: true,
                      headerBackVisible: false,
                      headerTitle: (props: any) => {
                        return <HeaderTitle {...props} />;
                      },
                      headerLeft: props => (
                        <NavigationBackButton {...props} icon="arrow-left" />
                      ),
                      headerBackground: () => <HeaderBackground />,
                    }}
                  />
                  <Stack.Screen
                    name="Dialog"
                    component={DialogScreen}
                    options={{
                      animation: 'slide_from_bottom',
                      gestureEnabled: true,
                      headerBackVisible: false,
                      headerTitle: (props: any) => {
                        return <HeaderTitle {...props} />;
                      },
                      headerLeft: props => (
                        <NavigationBackButton {...props} icon="close" />
                      ),
                      headerBackground: () => <HeaderBackground />,
                    }}
                    initialParams={{screen}}
                  />
                  <Stack.Screen
                    name="Modal"
                    component={ModalScreen}
                    options={{
                      headerShown: false,
                      headerBackground: undefined,
                      presentation: 'containedTransparentModal',
                      animation: 'fade',
                      contentStyle: {backgroundColor: Colors.modal},
                    }}
                    initialParams={{screen}}
                  />
                </Stack.Navigator>
              </ReactNavigationContainer>
            </BottomSheetModalProvider>
          </ApplicationContext.Provider>
        </I18nextProvider>
        <LoadingView ref={navigator.loadingRef} />
        <ToastView ref={navigator.toastRef} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export {ApplicationContext, NavigationContainer};
