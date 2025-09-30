import React, {useContext, useRef, useState} from 'react';
import {useWindowDimensions, View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';

import {SafeAreaView} from 'react-native-safe-area-context';
import Assets from '@assets';
import {
  ApplicationContext,
  Button,
  Image,
  Screen,
  ScreenContainerProps,
  Shadow,
  SizedBox,
  Spacing,
  Styles,
  Text,
} from '@passionui/components';
import styles from './styles';
import Carousel, {ICarouselInstance} from 'react-native-reanimated-carousel';

const DEFAULT = [
  {
    title: 'onboard_base_title',
    description: 'onboard_basic_message',
    image: Assets.image.intro1,
    value: 'basic',
    domain: 'https://demo.listarapp.com',
  },
  {
    title: 'onboard_professional_title_1',
    description: 'onboard_professional_message_1',
    image: Assets.image.intro2,
    value: 'food',
    domain: 'https://food.listarapp.com',
  },
  {
    title: 'onboard_professional_title_2',
    description: 'onboard_professional_message_2',
    image: Assets.image.intro3,
    value: 'real_estate',
    domain: 'https://realestate.listarapp.com',
  },
  {
    title: 'onboard_professional_title_3',
    description: 'onboard_professional_message_3',
    image: Assets.image.intro4,
    value: 'event',
    domain: 'https://event.listarapp.com',
  },
];

const OnBoarding: React.FC<ScreenContainerProps> = ({navigation}) => {
  const {theme, navigator, translate} = useContext(ApplicationContext);
  const {width} = useWindowDimensions();
  const carouselRef = useRef<ICarouselInstance>(null);

  const [index, setIndex] = useState(0);

  /**
   * render item of slides
   *
   * @return {*}
   * @param data
   */
  const renderItem = (data: any): any => {
    return (
      <View style={[Styles.flexCenter, Styles.paddingL]}>
        <Image
          source={data.item.image}
          style={styles.image}
          resizeMode="cover"
        />
        <SizedBox height={Spacing.L} />
        <Text typography="title3" fontWeight={'bold'} style={Styles.textCenter}>
          {translate(data.item.title)}
        </Text>
        <SizedBox height={Spacing.L} />
        <Text typography="subhead" style={Styles.textCenter}>
          {translate(data.item.description)}
        </Text>
        <SizedBox height={Spacing.S} />
        <Text
          typography="footnote"
          style={Styles.textCenter}
          color={theme.colors.primary.default}>
          {data.item.domain}
        </Text>
      </View>
    );
  };

  return (
    <Screen
      navigation={navigation}
      headerType={'default'}
      options={{title: '', headerLeft: () => null}}>
      <LinearGradient
        colors={[
          theme.colors.primary.default,
          theme.colors.background.default,
          theme.colors.background.default,
        ]}
        style={Styles.flex}>
        <Carousel
          width={width}
          ref={carouselRef}
          data={DEFAULT}
          defaultIndex={index}
          renderItem={renderItem}
          onScrollEnd={setIndex}
        />
        <SafeAreaView
          edges={['bottom']}
          style={[
            Shadow.light,
            styles.actionContainer,
            {backgroundColor: theme.colors.background.surface},
          ]}>
          <Button
            title={translate('skip')}
            onPress={() => navigator?.pop()}
            type={'text'}
            size={'medium'}
            full={false}
          />
          <Button
            title={translate('next')}
            onPress={() => carouselRef.current?.next()}
            type={'text'}
            size={'medium'}
            full={false}
          />
        </SafeAreaView>
      </LinearGradient>
    </Screen>
  );
};

export {OnBoarding};
