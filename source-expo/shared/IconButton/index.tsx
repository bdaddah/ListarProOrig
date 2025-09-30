import React, {useContext} from 'react';
import {TouchableOpacity} from 'react-native';
import {ApplicationContext, Colors, Icon, IconButtonProps} from '../index';
import styles from './styles';

const IconButton: React.FC<IconButtonProps> = ({
  type = 'primary',
  color,
  icon,
  size = 'small',
  shape = 'circle',
  onPress,
  ...rest
}) => {
  const {theme} = useContext(ApplicationContext);

  /**
   * get size icon button
   */
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.small;
      case 'medium':
        return styles.medium;
      default:
        return styles.large;
    }
  };

  /**
   * get style for icon button by type
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
   * get color for icon
   */
  const getIconColor = () => {
    switch (type) {
      case 'disabled':
        return theme.colors.text.default + '80';
      case 'primary':
        return Colors.white;
      case 'tonal':
        return color ?? theme.colors.primary.default;
      case 'secondary':
        return color ?? theme.colors.text.default;
      case 'outline':
        return color ?? theme.colors.primary.default;
      default:
        return Colors.white;
    }
  };

  /**
   * get size icon
   */
  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 20;
      case 'medium':
        return 22;
      default:
        return 24;
    }
  };

  const activeOpacity = type === 'disabled' ? 0.75 : 0.5;

  return (
    <TouchableOpacity
      {...rest}
      disabled={type === 'disabled'}
      activeOpacity={activeOpacity}
      onPress={onPress}
      style={[
        getTypeStyle(),
        getSizeStyle(),
        shape === 'rounded' && styles.round,
      ]}>
      <Icon size={getIconSize()} name={icon} color={getIconColor()} />
    </TouchableOpacity>
  );
};

export {IconButton};
