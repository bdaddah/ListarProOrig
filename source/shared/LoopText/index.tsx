import React, {useContext, useEffect, useRef, useState} from 'react';
import {Animated} from 'react-native';
import {ApplicationContext, getTypoStyle, LoopTextProps} from '../index';

const LoopText: React.FC<LoopTextProps> = ({
  labels = ['Hello world!'],
  delay = 2000,
  duration = 500,
  style,
  ...props
}) => {
  const {theme} = useContext(ApplicationContext);
  const animationValue = useRef(new Animated.Value(0)).current;
  const [count, setCount] = useState(0);

  useEffect(() => {
    animationValue.setValue(0);
    const fadeInOut = (callback = () => {}) => {
      Animated.sequence([
        Animated.timing(animationValue, {
          delay: 200,
          duration: duration,
          toValue: 0.5,
          useNativeDriver: true,
        }),
        Animated.timing(animationValue, {
          delay: delay,
          duration: duration,
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start(() => {
        callback();
      });
    };

    fadeInOut(() => {
      setCount(count + 1 < labels.length ? count + 1 : 0);
    });

    return () => {
      animationValue.stopAnimation();
    };
  }, [count, animationValue, delay, duration, labels.length]);

  return (
    <Animated.Text
      style={[
        getTypoStyle(theme, 'caption1', 'medium'),
        {
          color: theme.colors.text.default,
          opacity: animationValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 1, 0],
          }),
          transform: [
            {
              translateY: animationValue.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [-10, 0, 10],
              }),
            },
          ],
        },
        style,
      ]}
      {...props}>
      {labels[count]}
    </Animated.Text>
  );
};

export {LoopText};
