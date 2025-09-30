import {Animated, StyleProp, View, ViewStyle} from 'react-native';
import styles from './styles';
import React, {FC, useContext, useEffect, useRef} from 'react';
import {ApplicationContext, getTypoStyle, Icon, Text, Theme} from '../index';

type FloatingViewProps = {
  floatingValue?: string;
  floatingIconColor?: string;
  disabled?: boolean;
  floatingIcon?: string;
  required?: boolean;
};

type ErrorViewProps = {
  error?: string;
  style?: StyleProp<ViewStyle>;
};

export const getBorderColor = (
  theme: Theme,
  focused?: boolean,
  error?: string,
  disabled?: boolean,
) => {
  let borderColor = theme.colors.border.default;

  if (focused) {
    borderColor = theme.colors.primary.default;
  }

  if (error) {
    borderColor = theme.colors.error.default;
  }

  if (disabled) {
    borderColor = theme.colors.border.disable;
  }

  return {borderColor, borderWidth: 1};
};

export const getSizeStyle = (size?: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'medium':
      return styles.mediumContainer;
    case 'large':
      return styles.largeContainer;
    default:
      return styles.smallContainer;
  }
};

export const getIconSize = (size?: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'medium':
      return 20;
    case 'large':
      return 24;
    default:
      return 18;
  }
};

export const getFontStyle = (
  theme: Theme,
  size?: 'small' | 'medium' | 'large',
) => {
  switch (size) {
    case 'medium':
      return getTypoStyle(theme, 'subhead', 'semibold');
    case 'large':
      return getTypoStyle(theme, 'title3', 'bold');
    default:
      return getTypoStyle(theme, 'subhead');
  }
};

export const ErrorView: FC<ErrorViewProps> = ({error, style}) => {
  const {theme} = useContext(ApplicationContext);
  const errorHeight = useRef(new Animated.Value(0));

  useEffect(() => {
    if (error) {
      Animated.timing(errorHeight.current, {
        toValue: 20,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(errorHeight.current, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [error]);

  return (
    <Animated.View
      style={[styles.errorView, {height: errorHeight.current}, style]}>
      <View style={styles.errorIcon}>
        <Icon
          color={theme.colors.error.default}
          name="alert-circle-outline"
          size={16}
        />
      </View>
      <Text
        color={theme.colors.error.default}
        numberOfLines={2}
        typography={'caption1'}>
        {error}
      </Text>
    </Animated.View>
  );
};

export const FloatingView: FC<FloatingViewProps> = ({
  floatingValue,
  floatingIconColor,
  disabled,
  floatingIcon,
  required,
}) => {
  const {theme} = useContext(ApplicationContext);

  if (floatingValue) {
    let floatingTextColor = theme.colors.text.hint;
    let floatingIconTintColor = floatingIconColor;
    if (disabled) {
      floatingTextColor = theme.colors.text.disable;
      floatingIconTintColor = theme.colors.text.disable;
    }

    return (
      <View
        style={[
          styles.floatingView,
          {backgroundColor: theme.colors.background.surface},
        ]}>
        <Text
          color={floatingTextColor}
          typography={'caption1'}
          fontWeight={'medium'}
          numberOfLines={1}>
          {floatingValue}
          {required && (
            <Text
              typography={'caption1'}
              fontWeight={'medium'}
              color={theme.colors.error.default}>
              *
            </Text>
          )}
        </Text>
        {!!floatingIcon && (
          <Icon
            color={floatingIconTintColor}
            name={floatingIcon}
            size={16}
            style={styles.floatingIcon}
          />
        )}
      </View>
    );
  }
  return null;
};
