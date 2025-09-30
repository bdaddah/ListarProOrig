import React, {FC, useContext} from 'react';
import {Animated} from 'react-native';
import {ApplicationContext, DotProps} from '../index';
import styles from './styles';

const Dot: FC<DotProps> = ({active, style}) => {
  const {theme} = useContext(ApplicationContext);
  const dotStyle = active
    ? [styles.activeDot]
    : [styles.inactiveDot, {backgroundColor: theme.colors.background.disable}];

  return <Animated.View style={[style, dotStyle]} />;
};

export default Dot;
