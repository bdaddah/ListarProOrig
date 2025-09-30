import React, {FC, useContext} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  ApplicationContext,
  ButtonProps,
  Colors,
  Icon,
  Radius,
  Text,
  Typography,
} from '../index';
import styles from './styles';

const Button: FC<ButtonProps> = ({
  type = 'primary',
  size = 'large',
  color,
  full = true,
  round = false,
  trailing,
  leading,
  title = 'Button',
  gradientProps,
  onPress,
  loading,
  ...rest
}) => {
  const {theme} = useContext(ApplicationContext);
  const getSizeStyle = () => {
    const styleSheet: {[key: string]: any} = styles;
    return styleSheet[size ?? 'small'];
  };

  /**
   * get style for button by type
   */
  const getTypeStyle = () => {
    switch (type) {
      case 'disabled':
        return {
          backgroundColor: theme.colors.background.disable,
        };
      case 'primary':
        return {backgroundColor: color ?? theme.colors.primary.default};
      case 'outline':
        return {
          backgroundColor: theme.colors.background.surface,
          borderWidth: 1,
          borderColor: color ?? theme.colors.primary.default,
        };
      case 'tonal':
        return {
          backgroundColor: color
            ? Colors.lighten(color, 32)
            : theme.colors.primary.container,
        };
      default:
        return {};
    }
  };

  /**
   * export icon size
   */
  const getIconSize = () => {
    switch (size) {
      case 'large':
        return 24;
      case 'medium':
      case 'small':
        return 16;

      default:
        return 24;
    }
  };

  /**
   * export icon size
   */
  const getIconSpace = () => {
    switch (size) {
      case 'large':
      case 'medium':
        return 8;
      case 'small':
        return 4;

      default:
        return 8;
    }
  };

  /**
   * export typography style
   */
  const getTypography = (): Typography => {
    switch (size) {
      case 'large':
        return 'callout';
      case 'medium':
        return 'subhead';
      case 'small':
        return 'caption1';

      default:
        return 'callout';
    }
  };

  const getTextColor = (): string => {
    switch (type) {
      case 'disabled':
        return theme.colors.text.default + '80';
      case 'primary':
        return Colors.white;
      case 'outline':
        return color ?? theme.colors.primary.default;
      case 'tonal':
        return color ?? theme.colors.primary.default;
      case 'text':
        return color ?? theme.colors.primary.default;
      default:
        return Colors.white;
    }
  };

  /**
   * render title
   */
  const renderTitle = () => {
    const typography = getTypography();
    return (
      <Text
        typography={typography}
        color={getTextColor()}
        numberOfLines={1}
        fontWeight="bold">
        {title}
      </Text>
    );
  };

  /**
   * render leading
   */
  const renderLeading = () => {
    if (leading || loading) {
      const iconSize = getIconSize();
      const marginRight = getIconSpace();
      let content = leading;
      if (loading) {
        content = <ActivityIndicator color={getTextColor()} size={iconSize} />;
      } else if (typeof leading === 'string') {
        content = (
          <Icon color={getTextColor()} name={leading} size={iconSize} />
        );
      }
      return (
        <View
          style={[
            styles.leading,
            {width: iconSize, height: iconSize, marginRight},
          ]}>
          {content}
        </View>
      );
    }
  };

  /**
   * render trailing
   */
  const renderTrailing = () => {
    const marginLeft = getIconSpace();
    if (trailing) {
      const iconSize = getIconSize();
      return (
        <View
          style={[
            styles.trailing,
            {width: iconSize, height: iconSize, marginLeft},
          ]}>
          {typeof trailing === 'string' ? (
            <Icon color={getTextColor()} name={trailing} size={iconSize} />
          ) : (
            trailing
          )}
        </View>
      );
    }
  };

  const buttonStyle = StyleSheet.flatten([
    getSizeStyle(),
    getTypeStyle(),
    full && {width: '100%'},
    round && {borderRadius: Radius.XL},
  ]);

  const activeOpacity = type === 'disabled' ? 0.75 : 0.5;

  if (type === 'gradient') {
    return (
      <LinearGradient
        colors={[
          theme.colors.primary.light,
          theme.colors.primary.default,
          theme.colors.primary.default,
        ]}
        {...gradientProps}
        style={buttonStyle}>
        {renderLeading()}
        {renderTitle()}
        {renderTrailing()}
      </LinearGradient>
    );
  } else {
    return (
      <TouchableOpacity
        {...rest}
        disabled={type === 'disabled'}
        activeOpacity={activeOpacity}
        onPress={onPress}
        style={buttonStyle}>
        {renderLeading()}
        {renderTitle()}
        {renderTrailing()}
      </TouchableOpacity>
    );
  }
};

export {Button};
