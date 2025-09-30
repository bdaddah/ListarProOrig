import React, {FC, useContext} from 'react';
import {View, ViewStyle} from 'react-native';
import {
  ApplicationContext,
  Colors,
  Icon,
  Radius,
  Shadow,
  Spacing,
  TagProps,
  Text,
  Typography,
} from '../index';
import styles from './styles';

const Tag: FC<TagProps> = ({
  label = 'Label',
  icon,
  color,
  type = 'default',
  size = 'small',
  style,
}) => {
  const {theme} = useContext(ApplicationContext);

  /**
   * get style for button by type
   */
  const getTypeStyle = (): ViewStyle => {
    switch (type) {
      case 'rating':
        return {
          backgroundColor: color ?? theme.colors.primary.default,
          borderTopRightRadius: 0,
          borderRadius: Radius.S,
          borderBottomLeftRadius: Radius.S,
          borderTopLeftRadius: Radius.S,
          borderBottomRightRadius: Radius.S,
        };
      default:
        if (color) {
          return {
            backgroundColor: Colors.lighten(color!, 40),
            borderRadius: Radius.S,
          };
        }
        return {
          backgroundColor: theme.colors.background.surface,
          borderRadius: Radius.S,
        };
    }
  };

  /**
   * get size style
   */
  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'large':
        return {
          height: 28,
          paddingHorizontal: Spacing.M,
        };
      case 'medium':
        return {
          height: 24,
          paddingHorizontal: Spacing.M,
        };
      default:
        return {
          paddingHorizontal: Spacing.S,
          height: 20,
        };
    }
  };

  /**
   * get color for button by type
   */
  const getColor = () => {
    switch (type) {
      case 'rating':
        return Colors.white;

      default:
        return color;
    }
  };

  /**
   * get text
   */
  const getText = (): Typography => {
    switch (size) {
      case 'large':
        return 'footnote';
      case 'medium':
        return 'caption1';

      default:
        return 'caption2';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'large':
        return 20;
      case 'medium':
        return 18;

      default:
        return 16;
    }
  };

  return (
    <View
      style={[
        styles.container,
        Shadow.dark,
        getSizeStyle(),
        getTypeStyle(),
        style,
      ]}>
      {!!icon && (
        <Icon
          style={styles.icon}
          size={getIconSize()}
          name={icon}
          color={getColor()}
        />
      )}
      <Text color={getColor()} typography={getText()} fontWeight={'bold'}>
        {label}
      </Text>
    </View>
  );
};

export {Tag};
