import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {Animated, View} from 'react-native';
import PagerView from 'react-native-pager-view';
import {ApplicationContext, Styles} from '../index';
import {TabBarProps} from './types';
import styles from './styles';
import TabItem from './default';

export interface TabViewRef {
  setPage: (index: number) => void;
}

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

const TabView = forwardRef(
  (
    {
      initialIndex,
      onPressTabItem,
      tabs,
      direction,
      style,
      tabBarStyles,
      contentStyles,
    }: TabBarProps,
    ref,
  ) => {
    const pagerRef = useRef<any>(null);
    const {theme} = useContext(ApplicationContext);
    const [containerWidth, setContainerWidth] = useState<any>(undefined);
    const scrollX = useRef(new Animated.Value(0)).current;
    const itemWidth = containerWidth ? containerWidth / tabs.length : 0;
    const progress = useRef(new Animated.Value(0)).current;
    const [indexTab, setIndexTab] = useState(initialIndex ?? 0);
    const lazyRef = useRef([indexTab]).current;

    /**
     * forward ref to parent component
     */
    useImperativeHandle(ref, () => ({
      setPage: pagerRef.current?.setPage,
    }));

    useEffect(() => {
      if (itemWidth) {
        progress?.addListener(({value}) => {
          if (value >= 0 && value <= tabs.length - 1) {
            scrollX.setValue(itemWidth * value);
          }
        });
        Animated.timing(scrollX, {
          toValue: itemWidth * indexTab,
          duration: 250,
          useNativeDriver: false,
        }).start();
      }
    }, [scrollX, itemWidth, indexTab, progress, tabs.length]);

    const onPageScroll = (e: {nativeEvent: {position: any; offset: any}}) => {
      progress.setValue(e.nativeEvent.position + e.nativeEvent.offset);
    };

    /**
     * render content for tab view
     */
    const renderContent = () => {
      const useContent = !tabs.some(tab => tab.content === undefined);
      if (useContent) {
        return (
          <AnimatedPagerView
            onPageScroll={onPageScroll}
            onPageSelected={(e: {nativeEvent: {position: any}}) => {
              const next = e.nativeEvent.position;
              if (!lazyRef.includes(next)) {
                lazyRef.push(next);
              }
              if (indexTab !== next) {
                setIndexTab(next);
              }
            }}
            ref={pagerRef}
            useNext={false}
            initialPage={indexTab}
            style={[Styles.flex, contentStyles]}>
            {tabs.map((tab, index) => {
              if (lazyRef.includes(index)) {
                return <View key={`${tab.label}-${index}`}>{tab.content}</View>;
              }
              return <View key={`${tab.label}-${index}`} />;
            })}
          </AnimatedPagerView>
        );
      }
    };

    return (
      <View style={style}>
        <View
          style={[styles.tabBar, tabBarStyles]}
          onLayout={event => {
            const width = event.nativeEvent.layout.width;
            if (width !== itemWidth) {
              setContainerWidth(width);
            }
          }}>
          {tabs.map((tab, index) => {
            return (
              <TabItem
                key={`${tab.label}-${index}`}
                {...tab}
                direction={direction}
                active={index === indexTab}
                onPress={() => {
                  pagerRef.current?.setPage(index);
                  onPressTabItem?.(index);
                }}
              />
            );
          })}
          <View style={[styles.indicatorContainer, {width: itemWidth}]}>
            <Animated.View
              style={[
                styles.indicator,
                {
                  left: scrollX,
                  backgroundColor: theme.colors.primary.default,
                },
              ]}
            />
          </View>
        </View>
        {renderContent()}
      </View>
    );
  },
);

export {TabView};
