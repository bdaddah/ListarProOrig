import React, {useCallback, useContext, useEffect} from 'react';
import {LinearGradient} from 'expo-linear-gradient';
import {
  Animated,
  BackHandler,
  DeviceEventEmitter,
  StyleSheet,
  TextProps,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import {
  ApplicationContext,
  Colors,
  getTypoStyle,
  HeaderBackgroundProps,
  Icon,
  Image,
  InputRef,
  InputSearch,
  InputSearchProps,
  NavigationButtonProps,
  NavigationToolkitProps,
  Radius,
  Spacing,
  Styles,
} from '../index';

const styles = StyleSheet.create({
  extendedHeader: {
    position: 'absolute',
    width: '100%',
  },
  backButton: {
    height: 28,
    width: 28,
    borderRadius: 14,
  },
  navigationButton: {
    height: 32,
    width: 32,
    borderRadius: Radius.L,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000040',
  },
  headerTitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  circle: {width: 36, height: 36, borderRadius: 18},
  square: {width: 36, height: 36, borderRadius: Radius.XS},
  headerImage: {width: '100%', height: 154},
  headerBannerImage: {width: '100%', height: 240},
  headerBanner: {
    width: '100%',
    height: '100%',
  },
  headerButton: {paddingHorizontal: 4},
  headerRightButton: {
    flexDirection: 'row',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -12,
  },
  toolkitContainer: {
    marginLeft: Spacing.S,
    padding: Spacing.XS,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#00000040',
  },
  divider: {
    width: 1,
    height: 12,
    marginHorizontal: 4,
  },
  headerLeft: {
    marginLeft: -8,
  },
});

const HeaderTitle: React.FC<
  TextProps & {animatedValue: Animated.Value; tintColor: string}
> = React.memo(props => {
  const {theme} = useContext(ApplicationContext);
  const opacity = props.animatedValue?.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <Animated.Text
      {...props}
      style={[
        getTypoStyle(theme, 'headline', 'bold'),
        {opacity, color: props.tintColor},
      ]}
    />
  );
});

const HeaderSearch = React.memo(
  React.forwardRef<
    InputRef,
    InputSearchProps & {animatedValue?: Animated.Value; tintColor: string}
  >((props, ref) => {
    const {width} = useWindowDimensions();
    const opacity = props.animatedValue?.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          {
            opacity,
            width: width - Spacing.L * 2,
            paddingBottom: Spacing.S,
          },
        ]}>
        <InputSearch {...props} ref={ref} />
      </Animated.View>
    );
  }),
);

const NavigationButton: React.FC<NavigationButtonProps> = ({
  icon,
  tintColor,
  onPress,
  style,
}) => {
  const {theme} = useContext(ApplicationContext);
  let buttonStyle: ViewStyle = {
    backgroundColor: 'transparent',
    borderColor: theme.colors.text.hint,
    borderWidth: 0.5,
  };
  if (tintColor === Colors.white) {
    buttonStyle = {};
  }
  return (
    <TouchableOpacity
      style={[styles.navigationButton, style, buttonStyle]}
      onPress={onPress}>
      <Icon
        name={icon}
        color={tintColor ?? theme.colors.text.default}
        size={20}
      />
    </TouchableOpacity>
  );
};

const NavigationBackButton: React.FC<NavigationButtonProps> = React.memo(
  ({onPress, ...props}) => {
    const {navigator} = useContext(ApplicationContext);

    const goBack = useCallback(() => {
      const canGoBack = navigator?.ref.current?.canGoBack();
      if (canGoBack) {
        navigator?.ref.current?.goBack();
      } else {
        DeviceEventEmitter.emit('dismiss', undefined);
      }
      onPress?.();
      return true;
    }, [navigator?.ref, onPress]);

    useEffect(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        goBack,
      );

      return () => backHandler.remove();
    }, [goBack]);

    return (
      <View style={styles.headerLeft}>
        <NavigationButton
          {...props}
          onPress={goBack}
          style={styles.backButton}
        />
      </View>
    );
  },
);

const HeaderBackground: React.FC<HeaderBackgroundProps> = React.memo(
  ({surface = false, animatedValue}) => {
    const {theme} = useContext(ApplicationContext);
    const opacity = animatedValue?.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[Styles.flex, {opacity}]}>
        {surface ? (
          <View
            style={[
              Styles.flex,
              {backgroundColor: theme.colors.background.surface},
            ]}
          />
        ) : (
          <LinearGradient
            colors={[
              theme.colors.primary.light,
              theme.colors.background.default,
            ]}
            style={[styles.extendedHeader, styles.headerImage]}>
            {theme.assets?.headerBackground && (
              <Image
                source={theme.assets?.headerBackground}
                style={Styles.flex}
                loading={false}
              />
            )}
          </LinearGradient>
        )}
      </Animated.View>
    );
  },
);

const HeaderRightAction: React.FC<any> = ({children, ...restProps}) => {
  const renderAction = () => {
    if (Array.isArray(children)) {
      return children.map((child, index) => {
        return (
          <View key={index} style={styles.headerButton}>
            {React.cloneElement(child, {...restProps})}
          </View>
        );
      });
    }

    return (
      <View style={styles.headerButton}>
        {React.cloneElement(children, {...restProps})}
      </View>
    );
  };
  return <View style={styles.headerRightButton}>{renderAction()}</View>;
};

const HeaderBanner: React.FC<ViewProps & {animatedValue: Animated.Value}> = ({
  animatedValue,
  children,
  style,
  ...props
}) => {
  const scale = animatedValue.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: [4, 1, 1],
    extrapolate: 'clamp',
  });
  const opacity = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      {...props}
      style={[
        styles.headerBannerImage,
        {
          opacity,
          transform: [{scale}],
        },
        style,
      ]}>
      {children}
    </Animated.View>
  );
};

const HeaderToolkitAction: React.FC<NavigationToolkitProps> = ({tintColor}) => {
  const {theme} = useContext(ApplicationContext);

  const onMore = () => {};

  let buttonStyle: ViewStyle = {
    backgroundColor: 'transparent',
    borderColor: theme.colors.text.hint,
    borderWidth: 0.5,
  };
  if (tintColor === Colors.white) {
    buttonStyle = {};
  }

  return (
    <View style={styles.headerRightButton}>
      <View style={[styles.toolkitContainer, buttonStyle]}>
        <TouchableOpacity onPress={onMore}>
          <Icon color={tintColor} name="dots-horizontal" size={20} />
        </TouchableOpacity>
        <View style={[styles.divider, {backgroundColor: tintColor}]} />
        <TouchableOpacity
          onPress={() => {
            DeviceEventEmitter.emit('dismiss', undefined);
          }}>
          <Icon color={tintColor} name="close-circle-outline" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export {
  NavigationButton,
  HeaderTitle,
  HeaderSearch,
  NavigationBackButton,
  HeaderBackground,
  HeaderBanner,
  HeaderRightAction,
  HeaderToolkitAction,
};
