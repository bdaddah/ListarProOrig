import React, {FC, useContext, useRef, useState} from 'react';
import {Animated, View} from 'react-native';
import {ApplicationContext, ScrollIndicatorProps} from '../index';
import styles from './styles';

const INDICATOR_WIDTH = 24;
const INDICATOR_CONTAINER_WIDTH = 72;
const PaginationScroll: FC<ScrollIndicatorProps> = ({
  style,
  children,
  scrollViewRef,
}) => {
  const {theme} = useContext(ApplicationContext);
  const left = useRef(new Animated.Value(0)).current;
  const [scrollViewWidth, setScrollViewWidth] = useState(0);
  const [scrollContentWidth, setScrollContentWidth] = useState(0);

  const translateX = () => {
    if (scrollViewWidth && scrollContentWidth) {
      const value = left.interpolate({
        inputRange: [0, scrollContentWidth - scrollViewWidth],
        outputRange: [0, INDICATOR_CONTAINER_WIDTH - INDICATOR_WIDTH],
        extrapolate: 'clamp',
      });
      return {transform: [{translateX: value}]};
    }
    return {};
  };

  const renderScrollView = () => {
    return (
      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: left,
                },
              },
            },
          ],
          {useNativeDriver: true},
        )}
        alwaysBounceHorizontal={false}
        showsHorizontalScrollIndicator={false}
        horizontal
        style={styles.scrollView}
        onContentSizeChange={width => {
          setScrollContentWidth(width);
        }}
        onLayout={e => {
          setScrollViewWidth(e.nativeEvent.layout.width);
        }}>
        {children}
      </Animated.ScrollView>
    );
  };
  const renderIndicator = () => {
    return (
      <View
        style={[
          styles.indicatorContainer,
          {backgroundColor: theme.colors.background.disable},
        ]}>
        <Animated.View
          style={[
            styles.indicator,
            {
              backgroundColor: theme.colors.primary.default,
            },
            translateX(),
          ]}
        />
      </View>
    );
  };

  return (
    <View style={[style, styles.scrollContainer]}>
      {renderScrollView()}
      {renderIndicator()}
    </View>
  );
};

export default PaginationScroll;
