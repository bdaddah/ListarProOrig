import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {Animated, Easing, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ApplicationContext, SkeletonTypes, Styles} from '../index';
import styles from './styles';

const Skeleton: React.FC<SkeletonTypes> = ({style}) => {
  const {theme} = useContext(ApplicationContext);
  const [width, setWidth] = useState(0);
  const PRIMARY_COLOR = theme.colors.background.disable + '40';
  const HIGHLIGHT_COLOR1 = 'transparent';
  const HIGHLIGHT_COLOR2 = 'transparent';
  const beginShimmerPosition = useRef(new Animated.Value(0)).current;

  const shimmerColors = [HIGHLIGHT_COLOR1, HIGHLIGHT_COLOR2, PRIMARY_COLOR];
  const linearTranslate = beginShimmerPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });
  const animatedValue = useMemo(() => {
    return Animated.loop(
      Animated.timing(beginShimmerPosition, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
  }, [beginShimmerPosition]);

  useEffect(() => {
    animatedValue.start();
    return () => {
      animatedValue.stop();
    };
  }, [animatedValue]);

  const onLayout = (newWidth: number) => {
    if (newWidth !== width) {
      setWidth(newWidth);
    }
  };
  return (
    <View style={[styles.container, style, styles.protect]}>
      <View
        onLayout={e => onLayout(e.nativeEvent.layout.width)}
        style={[Styles.flex, {backgroundColor: PRIMARY_COLOR}]}>
        <Animated.View
          style={[
            styles.shimmer,
            {transform: [{translateX: linearTranslate}]},
          ]}>
          <LinearGradient
            style={[StyleSheet.absoluteFill]}
            colors={shimmerColors}
            start={{
              x: 0,
              y: 0,
            }}
            end={{
              x: 1,
              y: 0,
            }}
          />
        </Animated.View>
      </View>
    </View>
  );
};

export {Skeleton};
