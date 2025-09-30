import React, {FC, useContext, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';

import {ApplicationContext, Colors, Icon, Styles, Text} from '../index';
import {StepperProps} from './types';
import styles from './styles';

const Stepper: FC<StepperProps> = ({
  defaultValue = 0,
  max = 100,
  min = 0,
  onChange,
  style,
}) => {
  const {theme} = useContext(ApplicationContext);
  const [value, setValue] = useState(defaultValue);

  /**
   * on increase value
   */
  const onIncrease = () => {
    if (value < max) {
      setValue(value + 1);
      onChange?.(value + 1);
    }
  };

  /**
   * on decrease value
   */
  const onDecrease = () => {
    if (value > min) {
      setValue(value - 1);
      onChange?.(value - 1);
    }
  };

  const decrease = value > min;
  const increase = value < max;
  return (
    <View style={[Styles.row, style]}>
      <TouchableOpacity
        onPress={onDecrease}
        style={[
          styles.step,
          {
            backgroundColor: decrease
              ? theme.colors.primary.default
              : theme.colors.background.disable,
          },
        ]}>
        <Icon
          name={'minus'}
          color={decrease ? Colors.white : theme.colors.text.hint}
        />
      </TouchableOpacity>
      <View style={[styles.value, {borderColor: theme.colors.border.default}]}>
        <Text typography={'callout'}>{value}</Text>
      </View>
      <TouchableOpacity
        onPress={onIncrease}
        style={[
          styles.step,
          {
            backgroundColor: increase
              ? theme.colors.primary.default
              : theme.colors.background.disable,
          },
        ]}>
        <Icon
          name={'plus'}
          color={increase ? Colors.white : theme.colors.text.hint}
        />
      </TouchableOpacity>
    </View>
  );
};

export {Stepper};
