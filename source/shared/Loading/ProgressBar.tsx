import React, {FC, useContext, useEffect, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {ApplicationContext, ProgressBarProps, Radius} from '../index';

const ProgressBar: FC<ProgressBarProps> = ({percent = 0, style}) => {
  const {theme} = useContext(ApplicationContext);
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: percent,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [percent, animation]);

  const width = animation.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      style={[
        style,
        styles.progressContainer,
        {backgroundColor: theme.colors.background.disable},
      ]}>
      <Animated.View
        style={[
          styles.line,
          {
            width,
            backgroundColor: theme.colors.primary.default,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    width: '100%',
    height: 4,
    borderRadius: Radius.XXS,
  },
  line: {
    height: 4,
    borderRadius: Radius.XXS,
  },
});

export default ProgressBar;
