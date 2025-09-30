import React, {useContext, useRef, useState} from 'react';
import {
  ApplicationContext,
  Colors,
  Image,
  Screen,
  ScreenContainerProps,
  SizedBox,
  Spacing,
  Styles,
  Text,
} from '@passionui/components';

import {FlatList, Pressable, View} from 'react-native';
import {ProductModel} from '@models+types';
import {ImageSlider, ImageSliderRef, SpaceList} from '@components';
import styles from './styles';
import GalleryPreview from 'react-native-gallery-preview';

const Gallery: React.FC<ScreenContainerProps> = ({navigation, ...props}) => {
  const product: ProductModel = props.item;
  const {theme, translate} = useContext(ApplicationContext);
  const listRef = useRef<FlatList>(null);
  const galleryRef = useRef<ImageSliderRef>(null);
  const [indexSelected, setIndexSelected] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  /**
   * on press image
   * @param index
   */
  const onPressImage = (index: number) => {
    if (index === indexSelected) {
      return;
    }
    galleryRef.current?.scrollTo({index, animated: true});
  };

  /**
   * on change index
   * @param index
   */
  const onChange = (index: number) => {
    setIndexSelected(index);
    listRef.current?.scrollToIndex({
      animated: true,
      index: index,
    });
  };

  return (
    <Screen
      navigation={navigation}
      options={{
        title: translate('gallery'),
      }}
      edges={['bottom']}
      backgroundColor={Colors.black}>
      <View style={Styles.flex}>
        <View style={Styles.flexCenter}>
          <ImageSlider
            ref={galleryRef}
            data={product?.galleries ?? []}
            autoPlay={false}
            resizeMode="contain"
            onChange={onChange}
            onPress={() => setIsVisible(true)}
          />
          <GalleryPreview
            isVisible={isVisible}
            initialIndex={indexSelected}
            onRequestClose={() => setIsVisible(false)}
            images={
              product?.galleries?.map(item => {
                return {uri: item.full};
              }) ?? []
            }
          />
        </View>
        <View>
          <View style={[Styles.rowSpace, Styles.paddingHorizontalM]}>
            <Text typography="subhead" fontWeight={'bold'} color={Colors.white}>
              {product?.title}
            </Text>
            <Text
              typography="caption1"
              fontWeight={'bold'}
              color={Colors.white}>
              {indexSelected}/{product?.galleries?.length}
            </Text>
          </View>
          <SizedBox height={Spacing.S} />
          <FlatList
            ref={listRef}
            contentContainerStyle={Styles.paddingHorizontalM}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={product?.galleries ?? []}
            keyExtractor={(item, index) => `photo${item?.id}${index}`}
            ItemSeparatorComponent={SpaceList}
            renderItem={({item, index}) => {
              return (
                <Pressable onPress={() => onPressImage(index)}>
                  <Image
                    style={[
                      styles.imageItem,
                      {borderColor: theme.colors.border.default},
                      index === indexSelected && {
                        borderColor: theme.colors.primary.default,
                      },
                    ]}
                    source={{uri: item.thumb}}
                  />
                </Pressable>
              );
            }}
          />
        </View>
      </View>
    </Screen>
  );
};

export {Gallery};
