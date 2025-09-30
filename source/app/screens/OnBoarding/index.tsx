import React, {useContext, useRef, useState} from 'react';
import {useWindowDimensions, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {SafeAreaView} from 'react-native-safe-area-context';
import Assets from '@assets';
import {
  ApplicationContext,
  Button,
  Colors,
  HeaderRightAction,
  Image,
  NavigationButton,
  Popup,
  Screen,
  ScreenContainerProps,
  Shadow,
  SheetPicker,
  SizedBox,
  Spacing,
  Styles,
  Text,
} from '@passionui/components';
import styles from './styles';
import Carousel, {ICarouselInstance} from 'react-native-reanimated-carousel';
import {Settings} from '../../configs';
import {getNational} from '../../utils';
import {applicationActions, languageSelect} from '@redux';
import {useSelector} from 'react-redux';
import {Splash} from '../Splash';

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
  const language = useSelector(languageSelect);
  const {width} = useWindowDimensions();
  const carouselRef = useRef<ICarouselInstance>(null);

  const [index, setIndex] = useState(0);

  /**
   * on change domain
   */
  const onChangeDomain = (domain: string) => {
    navigator?.popToTop();
    setTimeout(() => {
      applicationActions.onChangeDomain(domain, () => {
        navigator?.reset({screen: Splash});
      });
    }, 500);
  };

  /**
   * on language
   */
  const onLanguage = () => {
    navigator?.showBottomSheet({
      title: translate('change_language'),
      screen: () => (
        <SheetPicker
          data={Settings.languageSupport.map(i => {
            return {
              ...getNational(i),
              icon: (
                <Image source={getNational(i).icon} style={styles.iconTheme} />
              ),
            };
          })}
          selected={getNational(language)}
          onSelect={i => {
            navigator?.pop();
            applicationActions.onChangeLanguage(Settings.languageSupport[i]);
          }}
          renderItem={undefined}
        />
      ),
    });
  };

  /**
   * on domain
   */
  const onDomain = (domain: string) => {
    navigator?.showModal({
      screen: () => (
        <Popup
          title={translate('domain')}
          description={translate('domain_message')}
          primary={{
            title: translate('yes'),
            onPress: () => onChangeDomain(domain),
          }}
          secondary={{
            title: translate('close'),
            onPress: () => {},
          }}
        />
      ),
    });
  };

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
        <SizedBox height={Spacing.XL} />
        <Button
          title={translate('apply')}
          onPress={() => onDomain(data.item.domain)}
          type={'outline'}
          size={'medium'}
          full={false}
        />
      </View>
    );
  };

  const headerRight = (props: any) => {
    return (
      <HeaderRightAction {...props} tintColor={Colors.white}>
        <NavigationButton icon={'web'} onPress={onLanguage} />
      </HeaderRightAction>
    );
  };

  return (
    <Screen
      navigation={navigation}
      options={{
        headerBackground: () => null,
        headerLeft: () => null,
        title: '',
        headerTransparent: true,
        headerRight: headerRight,
      }}>
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
