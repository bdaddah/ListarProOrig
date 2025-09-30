import React, {useContext, useEffect, useLayoutEffect, useRef} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {
  Animated,
  Keyboard,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import StackScreen from './StackScreen';
import {
  ApplicationContext,
  BottomTabProps,
  Colors,
  getTypoStyle,
  HeaderBackground,
  HeaderTitle,
  Icon,
  NavigationBackButton,
  RootStackParamList,
  ScreenContainerProps,
  Text,
} from '../index';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

const TabScreen: React.FC<ScreenContainerProps> = ({route}) => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen
          name="Stack"
          component={StackScreen}
          initialParams={{
            ...route.params.initialParams,
            screen: route.params?.screen,
          }}
          options={{
            ...route.params?.options,
            headerBackTitleVisible: false,
            gestureEnabled: true,
            headerTitleAlign: 'center',
            headerTitle: (props: any) => {
              return <HeaderTitle {...props} />;
            },
            statusBarTranslucent: true,
            statusBarColor: 'transparent',
            headerBackVisible: false,
            headerLeft: props => (
              <NavigationBackButton {...props} icon="arrow-left" />
            ),
            headerBackground: () => <HeaderBackground />,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const BottomTab: React.FC<BottomTabProps> = ({
  tabs,
  initialRouteName,
  navigation,
}) => {
  const {theme} = useContext(ApplicationContext);
  const initialIndex = tabs.findIndex(i => i.name === initialRouteName);
  const indicatorAnimated = useRef(new Animated.Value(initialIndex));
  const activeIndex = useRef(initialIndex);
  const dimensions = useWindowDimensions();
  const itemWidth = dimensions.width / tabs.length;

  useLayoutEffect(() => {
    navigation?.setOptions({
      headerShown: false,
      headerTransparent: true,
      headerBackground: undefined,
    });
  }, [navigation]);

  useEffect(() => {
    Animated.timing(indicatorAnimated.current, {
      toValue: itemWidth * activeIndex.current,
      useNativeDriver: true,
      duration: 200,
    }).start();
  }, [itemWidth]);

  /**
   * handle for focus
   */
  const onFocus = (e: any) => {
    activeIndex.current = tabs.findIndex(i => e.target.includes(i.name));
    Animated.timing(indicatorAnimated.current, {
      toValue: itemWidth * activeIndex.current,
      useNativeDriver: true,
      duration: 200,
    }).start();
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        headerTransparent: true,
        headerBackground: undefined,
        tabBarLabelPosition: 'below-icon',
      }}
      initialRouteName={initialRouteName}>
      {tabs.map(item => {
        return (
          <Tab.Screen
            key={`BottomTab-${item.name}`}
            name={item.name}
            component={TabScreen}
            listeners={{
              focus: onFocus,
              tabPress: Keyboard.dismiss,
            }}
            initialParams={item}
            options={{
              tabBarBackground: () => (
                <View
                  style={[
                    styles.container,
                    {
                      backgroundColor: theme.colors.background.surface,
                    },
                  ]}>
                  <Animated.View
                    style={[
                      styles.indicatorContainer,
                      {
                        width: itemWidth,
                        transform: [{translateX: indicatorAnimated.current}],
                      },
                    ]}>
                    <View
                      style={[
                        styles.indicator,
                        {backgroundColor: theme.colors.primary.default},
                      ]}
                    />
                  </Animated.View>
                </View>
              ),
              tabBarLabel: ({focused, color, children}) => {
                return (
                  <Text
                    typography={'caption2'}
                    numberOfLines={1}
                    fontWeight={focused ? 'bold' : 'medium'}
                    color={color}>
                    {children}
                  </Text>
                );
              },
              tabBarStyle: styles.tabBarStyle,
              tabBarBadgeStyle: {
                ...getTypoStyle(theme, 'caption2', 'medium'),
                left: 8,
                height: 16,
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 15,
              },
              tabBarIcon: ({color, size}) => (
                <Icon name={item.icon} color={color} size={size} />
              ),
              ...item,
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  indicatorContainer: {position: 'absolute', top: 0},
  indicator: {
    height: 2,
    width: 48,
    alignSelf: 'center',
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  tabBarStyle: {
    paddingVertical: 4,
    borderTopWidth: 0,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black_10,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
export default BottomTab;
