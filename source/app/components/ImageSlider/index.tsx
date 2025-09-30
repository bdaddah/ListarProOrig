import React, {forwardRef, useContext, useImperativeHandle} from 'react';
import {
  Pressable,
  StyleProp,
  useWindowDimensions,
  View,
  ViewStyle,
  ImageResizeMode,
} from 'react-native';
import {
  ApplicationContext,
  Image,
  Skeleton,
  Styles,
} from '@passionui/components';
import {ImageModel} from '@models+types';
import Carousel, {
  ICarouselInstance,
  Pagination,
} from 'react-native-reanimated-carousel';
import {useSharedValue} from 'react-native-reanimated';
import styles from './styles';
import {TCarouselActionOptions} from 'react-native-reanimated-carousel/lib/typescript/types';

type ImageSliderProps = {
  style?: StyleProp<ViewStyle>;
  data?: ImageModel[];
  position?: number;
  autoPlay?: boolean;
  resizeMode?: ImageResizeMode;
  onChange?: (index: number) => void;
  onPress?: (index: number) => void;
};

export interface ImageSliderRef {
  scrollTo: (option: TCarouselActionOptions) => void;
}

const ImageSlider = forwardRef<ImageSliderRef, ImageSliderProps>(
  (
    {
      data,
      position = 30,
      autoPlay = true,
      resizeMode,
      onChange,
      onPress,
      style,
    },
    ref,
  ) => {
    const {theme} = useContext(ApplicationContext);
    const {width} = useWindowDimensions();
    const carouselRef = React.useRef<ICarouselInstance>(null);
    const progress = useSharedValue<number>(0);

    useImperativeHandle(ref, () => ({
      scrollTo: option => carouselRef.current?.scrollTo(option),
    }));

    const onPressPagination = (index: number) => {
      carouselRef.current?.scrollTo({
        count: index - progress.value,
        animated: true,
      });
    };

    /**
     * render content
     */
    const renderContent = () => {
      if (data && data?.length > 0) {
        return (
          <>
            <Carousel
              ref={carouselRef}
              autoPlay={autoPlay}
              width={width}
              data={data!}
              onProgressChange={progress}
              renderItem={({item, index}) => (
                <Pressable onPress={() => onPress?.(index)}>
                  <Image
                    source={{uri: item.full}}
                    style={Styles.full}
                    resizeMode={resizeMode}
                  />
                </Pressable>
              )}
              onScrollEnd={onChange}
            />
            <Pagination.Basic
              activeDotStyle={{
                backgroundColor: theme.colors.primary.default,
              }}
              progress={progress}
              data={data!}
              dotStyle={styles.dotStyle}
              containerStyle={[styles.containerPagination, {bottom: position}]}
              onPress={onPressPagination}
            />
          </>
        );
      }

      return <Skeleton />;
    };

    return <View style={[Styles.flex, style]}>{renderContent()}</View>;
  },
);

export {ImageSlider};
