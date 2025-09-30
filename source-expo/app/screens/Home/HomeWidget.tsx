import React, {useContext, useEffect, useState} from 'react';
import {
  ApplicationContext,
  Divider,
  Icon,
  IconButton,
  InputSearch,
  Screen,
  ScreenContainerProps,
  SheetPicker,
  SizedBox,
  Spacing,
  Styles,
  Text,
} from '@passionui/components';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {homeActions, homeSelect, settingSelect} from '@redux';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {CategoryModel} from '@models+types';
import {
  ImageSlider,
  ProductItem,
  ProductViewType,
  SpaceList,
} from '@components';
import {Authentication, ScanQR, Search, SubmitListing} from '@screens';

const HomeWidget: React.FC<ScreenContainerProps> = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const {width: widthDevice, height: heightDevice} = useWindowDimensions();
  const {theme, navigator, translate} = useContext(ApplicationContext);
  const home = useSelector(homeSelect);
  const setting = useSelector(settingSelect);
  const translationY = useSharedValue(0);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState<CategoryModel>();

  const scrollHandler = useAnimatedScrollHandler(
    ({layoutMeasurement, contentOffset, contentSize}) => {
      if (layoutMeasurement.height + contentOffset.y >= contentSize.height) {
        return;
      }
      translationY.value = contentOffset.y;
    },
  );
  let bannerHeight = 172;
  if (home.header?.type === 'basic') {
    bannerHeight = Math.min(heightDevice * 0.35, 240);
  }
  const headerStyle = useAnimatedStyle(() => {
    const minHeight = insets.top + 64;
    const height = withTiming(
      interpolate(
        translationY.value,
        [0, 0, bannerHeight, bannerHeight],
        [bannerHeight, bannerHeight, minHeight, minHeight],
      ),
      {duration: 0},
    );
    return {
      height,
      width: '100%',
      position: 'absolute',
      backgroundColor: theme.colors.background.default,
      zIndex: 1,
    };
  });
  const searchStyle = useAnimatedStyle(() => {
    const width = withTiming(
      interpolate(
        translationY.value,
        [0, 0, bannerHeight, bannerHeight],
        [widthDevice, widthDevice, widthDevice - 44, widthDevice - 44],
      ),
      {duration: 0},
    );
    return {
      width: width,
    };
  });

  const overlayStyle = useAnimatedStyle(() => {
    const opacity = withTiming(
      interpolate(translationY.value, [0, bannerHeight], [0, 1]),
      {duration: 0},
    );
    return {
      opacity,
      backgroundColor: theme.colors.background.default,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    };
  });

  useEffect(() => {
    homeActions.onLoadWidget();
  }, []);

  /**
   * on refresh
   */
  const onRefresh = async () => {
    setRefreshing(true);
    homeActions.onLoadWidget(() => {
      setRefreshing(false);
    });
  };

  /**
   * on sort listing
   */
  const onOptions = () => {
    navigator?.showBottomSheet({
      title: translate('select_location'),
      screen: () => {
        return (
          <SheetPicker
            data={home.options?.map((item: CategoryModel) => {
              return {...item, title: translate(item.title), value: item.id};
            })}
            selected={{title: location?.title ?? '', value: location?.id}}
            onSelect={index => {
              setLocation(home.options?.[index]);
              navigator?.pop();
            }}
            renderItem={undefined}
          />
        );
      },
    });
  };

  /**
   * on search
   */
  const onSearch = () => {
    navigator?.push({screen: Search});
  };

  /**
   * on scan qrcode
   */
  const onScan = () => {
    navigator?.push({screen: ScanQR});
  };

  /**
   * on submit listing
   */
  const onSubmit = () => {
    navigator?.push({
      screen: props => <Authentication {...props} screen={SubmitListing} />,
    });
  };

  /**
   * build floating component
   */
  const buildFloatingComponent = () => {
    if (setting?.enableSubmit && home.header?.type === 'basic') {
      return (
        <IconButton
          size={'large'}
          icon={'plus'}
          shape={'rounded'}
          onPress={onSubmit}
        />
      );
    }
    return null;
  };

  /**
   * build header
   */
  const buildHeader = () => {
    if (home.header?.type === 'basic') {
      return (
        <>
          <ImageSlider
            data={home?.header?.sliders}
            style={styles.sliderContainer}
          />
          <Animated.View style={[overlayStyle]} />
          <View style={styles.searchContainer}>
            <Pressable style={Styles.row} onPress={onSearch}>
              <InputSearch
                value={translate('search_location')}
                size={'large'}
                onPressIcon={onScan}
                onPress={onSearch}
                iconColor={theme.colors.primary.default}
                icon={'qrcode-scan'}
                editable={false}
                useShadow={true}
              />
              <Divider direction={'vertical'} style={styles.divider} />
            </Pressable>
          </View>
        </>
      );
    }

    return (
      <>
        <View
          style={[Styles.paddingM, Styles.rowSpace, {marginTop: insets.top}]}>
          <TouchableOpacity style={Styles.row} onPress={onOptions}>
            <Text typography={'headline'} fontWeight={'bold'}>
              {location?.title ?? translate('select_location')}
            </Text>
            <SizedBox width={Spacing.XXS} />
            <Icon name={'menu-down'} color={theme.colors.primary.default} />
          </TouchableOpacity>
          <IconButton
            icon={'plus'}
            size={'small'}
            type={'outline'}
            onPress={onSubmit}
          />
        </View>
        <Animated.View style={[styles.searchContainer, searchStyle]}>
          <Pressable style={Styles.row} onPress={onSearch}>
            <InputSearch
              value={translate('search_location')}
              size={'large'}
              onPressIcon={onScan}
              onPress={onSearch}
              iconColor={theme.colors.primary.default}
              icon={'qrcode-scan'}
              editable={false}
              useShadow={true}
            />
            <Divider direction={'vertical'} style={styles.divider} />
          </Pressable>
        </Animated.View>
      </>
    );
  };

  /**
   * build content widget list
   */
  const buildContentWidgetList = () => {
    if (home.widgets?.length > 0) {
      return (
        <FlatList
          scrollEnabled={false}
          data={home.widgets ?? []}
          renderItem={({item}) => item.build()}
          keyExtractor={(item, index) => `widget${item?.id}${index}`}
          ItemSeparatorComponent={SpaceList}
        />
      );
    }

    return (
      <FlatList
        contentContainerStyle={Styles.paddingHorizontalM}
        scrollEnabled={false}
        data={new Array(15)}
        renderItem={_ => (
          <ProductItem onPress={() => {}} type={ProductViewType.small} />
        )}
        keyExtractor={(item, index) => `placeholder${index}`}
        ItemSeparatorComponent={SpaceList}
      />
    );
  };

  return (
    <Screen
      navigation={navigation}
      headerType={'none'}
      style={Styles.flex}
      options={{statusBarStyle: 'light'}}
      floatingComponent={buildFloatingComponent()}>
      <Animated.View style={headerStyle}>{buildHeader()}</Animated.View>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            progressViewOffset={bannerHeight}
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.text.default}
            title={translate('pull_to_reload')}
            titleColor={theme.colors.text.default}
            colors={[theme.colors.primary.default]}
            progressBackgroundColor={theme.colors.background.surface}
          />
        }>
        <SizedBox height={bannerHeight} />
        <SizedBox height={Spacing.M} />
        {buildContentWidgetList()}
        <SizedBox height={Spacing.M} />
      </Animated.ScrollView>
    </Screen>
  );
};

export {HomeWidget};

const styles = StyleSheet.create({
  sliderContainer: {
    marginBottom: Spacing.XL + Spacing.XS,
    width: '100%',
  },
  searchContainer: {
    position: 'absolute',
    width: '100%',
    paddingHorizontal: Spacing.M,
    bottom: Spacing.XS,
    justifyContent: 'center',
  },
  divider: {position: 'absolute', right: 52, height: 32},
  /**
   * category
   */
  categoryContainer: {
    width: '100%',
    padding: Spacing.M,
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: Spacing.M,
  },
  categoryItem: {
    width: '25%',
  },
});
