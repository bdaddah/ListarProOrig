import React, {FC, useContext} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {ApplicationContext, RadioProps, Spacing, Styles, Text} from '../index';
import styles from './styles';

const Radio: FC<RadioProps> = ({
  value,
  groupValue,
  disabled,
  onChange,
  label,
  style,
}) => {
  const {theme} = useContext(ApplicationContext);
  const selected = value === groupValue;
  let disabledStyle = {};
  let checkBoxStyle = {
    borderWidth: 2,
    borderColor: theme.colors.text.default,
  };

  if (selected) {
    checkBoxStyle = {
      borderWidth: 6,
      borderColor: theme.colors.primary.default,
    };
  }
  if (disabled) {
    disabledStyle = {
      borderColor: selected
        ? theme.colors.primary.container
        : theme.colors.text.disable,
    };
  }

  return (
    <TouchableOpacity
      onPress={() => {
        onChange?.(value);
      }}
      disabled={disabled}
      style={[style, Styles.rowCenter]}>
      <View
        style={[
          styles.radio,
          checkBoxStyle,
          disabledStyle,
          label && {marginRight: Spacing.XS},
        ]}
      />
      {!!label && <Text typography={'footnote'}>{label}</Text>}
    </TouchableOpacity>
  );
};

export {Radio};
