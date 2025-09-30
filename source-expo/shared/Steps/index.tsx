import React, {FC} from 'react';
import {View} from 'react-native';
import {StepsProps} from './types';
import StepsHorizontal from './StepsHorizontal';
import StepsVertical from './StepsVertical';
import styles from './styles';

const Steps: FC<StepsProps> = ({
  direction = 'horizontal',
  steps = [
    {
      title: 'ABC',
      description: 'Description',
      time: '18:20',
    },
    {
      title: 'ABC',
      description: 'Description',
      time: '18:20',
    },
  ],
  ...props
}) => {
  return (
    <View style={styles.container}>
      {direction === 'horizontal' ? (
        <StepsHorizontal steps={steps} {...props} />
      ) : (
        <StepsVertical steps={steps} {...props} />
      )}
    </View>
  );
};

export {Steps};
