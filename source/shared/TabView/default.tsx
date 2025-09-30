import React, {useContext} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {
  ApplicationContext,
  Icon,
  SizedBox,
  Spacing,
  Styles,
  TabBarItemProps,
  Text,
  Typography,
} from '../index';

const TabItem: React.FC<TabBarItemProps> = ({
  label,
  icon,
  active,
  direction = 'column',
  onPress,
}) => {
  const {theme} = useContext(ApplicationContext);

  const typography: Typography = active ? 'callout' : 'subhead';
  const color = active ? theme.colors.primary.default : undefined;

  const buildIcon = () => {
    if (icon) {
      return (
        <>
          {typeof icon === 'string' ? (
            <Icon name={icon} size={24} color={color} />
          ) : (
            icon
          )}
          <SizedBox width={Spacing.XS} height={Spacing.XS} />
        </>
      );
    }
  };

  return (
    <TouchableOpacity
      style={[styles.tabItem, {flexDirection: direction}]}
      onPress={onPress}>
      {buildIcon()}
      {!!label && (
        <Text
          style={Styles.textCenter}
          numberOfLines={1}
          color={color}
          fontWeight={active ? 'semibold' : 'regular'}
          typography={typography}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tabItem: {
    padding: Spacing.M,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

export default TabItem;
