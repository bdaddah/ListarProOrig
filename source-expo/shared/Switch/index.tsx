import React, {FC, useContext} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {ApplicationContext, Colors, SwitchProps} from '../index';
import styles from './styles';

const Switch: FC<SwitchProps> = ({
  value = false,
  onChange,
  disabled = false,
  style,
}) => {
  const {theme} = useContext(ApplicationContext);
  const circleBackgroundColor = value ? Colors.white : Colors.black_17;
  const circleAlign = value ? 'flex-end' : 'flex-start';

  let backgroundColor = value
    ? theme.colors.primary.default
    : theme.colors.text.secondary;
  if (disabled) {
    backgroundColor = value
      ? theme.colors.primary.light
      : theme.colors.background.disable;
  }

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={() => {
        onChange?.(!value);
      }}
      style={[
        style,
        styles.container,
        {backgroundColor, alignItems: circleAlign},
      ]}>
      <View style={[styles.circle, {backgroundColor: circleBackgroundColor}]}>
        <View style={[styles.circleSmall, {backgroundColor}]} />
      </View>
    </TouchableOpacity>
  );
};

export {Switch};
