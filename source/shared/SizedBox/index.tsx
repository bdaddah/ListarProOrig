import React from 'react';
import {View, ViewStyle} from 'react-native';
import {SizedBoxProps} from './types';

const SizedBox: React.FC<SizedBoxProps> = ({width, height, ...props}) => {
  const style: ViewStyle = {
    width: width,
    height: height,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  };
  return <View style={style} {...props} />;
};

export {SizedBox};
