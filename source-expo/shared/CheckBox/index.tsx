import React, {FC, useContext} from 'react';
import {TouchableOpacity, View} from 'react-native';

import {ApplicationContext, CheckBoxProps, Colors, Icon, Text} from '../index';
import styles from './styles';

const CheckBox: FC<CheckBoxProps> = ({
  value,
  disabled = false,
  onChange,
  style,
  label,
  indeterminate,
}) => {
  const {theme} = useContext(ApplicationContext);
  const haveValue = value || indeterminate;
  const iconSource = indeterminate ? 'minus' : 'check';
  let borderColor = theme.colors.text.default;
  let backgroundColor = theme.colors.background.surface;

  if (haveValue) {
    borderColor = theme.colors.primary.default;
    backgroundColor = theme.colors.primary.default;
  }

  if (disabled) {
    borderColor = theme.colors.background.disable;
    backgroundColor = theme.colors.background.surface;
    if (haveValue) {
      borderColor = theme.colors.primary.light;
      backgroundColor = theme.colors.primary.light;
    }
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        onChange?.(!value);
      }}
      disabled={disabled}
      style={[styles.container, style]}>
      <View style={[{borderColor, backgroundColor}, styles.checkbox]}>
        {haveValue && <Icon color={Colors.white} size={16} name={iconSource} />}
      </View>
      {!!label && <Text typography={'footnote'}>{label}</Text>}
    </TouchableOpacity>
  );
};

export {CheckBox};
