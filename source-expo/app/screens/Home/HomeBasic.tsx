import React, {useContext, useEffect, useState} from 'react';
import {
  ApplicationContext,
  ContainerList,
  Divider,
  IconButton,
  InputSearch,
  Screen,
  ScreenContainerProps,
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
import {CategoryModel, CategoryViewType, ProductModel} from '@models+types';
import {
  CategoryItem,
  ImageSlider,
  ProductItem,
  ProductViewType,
  SpaceList,
} from '@components';
import {
  Authentication,
  Category,
  ProductDetail,
  ProductList,
  ScanQR,
  Search,
  SubmitListing,
} from '@screens';

const HomeBasic: React.FC<ScreenContainerProps> = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const {height: heightDevice} = useWindowDimensions();
  const bannerHeight = Math.min(heightDevice * 0.35, 240);
  const {theme, navigator, translate} = useContext(ApplicationContext);
  const home = useSelector(homeSelect);
  const setting = useSelector(settingSelect);
  const translationY = useSharedValue(0);
  const [refreshing, setRefreshing] = useState(false);

  const scrollHandler = useAnimatedScrollHandler(
    ({layoutMeasurement, contentOffset, contentSize}) => {
      if (layoutMeasurement.height + contentOffset.y >= contentSize.height) {
        return;
      }
      translationY.value = contentOffset.y;
    },
  );

  useEffect(() => {
    homeActions.onLoad();
  }, []);

  /**
   * on refresh
   */
  const onRefresh = async () => {
    setRefreshing(true);
    homeActions.onLoad(() => {
      setRefreshing(false);
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
   * onPress category
   * @param item
   */
  const onCategory = (item: CategoryModel) => {
    if (item?.hasChild) {
      if (item?.id === -1) {
        navigator?.push({screen: Category});
      } else {
        navigator?.push({screen: Category, item});
      }
    } else {
      navigator?.push({screen: ProductList, item});
    }
  };

  /**
   * on press product
   */
  const onProduct = (item: ProductModel) => {
    navigator?.push({screen: ProductDetail, item});
  };

  /**
   * on submit listing
   */
  const onSubmit = () => {
    navigator?.push({
      screen: props => <Authentication {...props} screen={SubmitListing} />,
    });
  };

  const actionStyle = useAnimatedStyle(() => {
    const minHeight = insets.top + 60;
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

  /**
   * build category
   */
  const buildCategories = () => {
    const data = home?.category?.slice?.(0, 7);
    let more;
    if (data) {
      more = (
        <View style={styles.categoryItem}>
          <CategoryItem
            type={CategoryViewType.iconCircle}
            item={
              new CategoryModel({
                id: -1,
                icon: 'ellipsis-h',
                color: theme.colors.primary.default,
                hasChild: true,
                title: translate('more'),
              })
            }
            onPress={onCategory}
          />
        </View>
      );
    }
    return (
      <View style={styles.categoryContainer}>
        {(data ?? Array.from(Array(15).keys())).map((item: any, index: any) => (
          <View key={`categories${index}`} style={styles.categoryItem}>
            <CategoryItem
              item={item}
              type={CategoryViewType.iconCircle}
              onPress={onCategory}
            />
          </View>
        ))}
        {more}
      </View>
    );
  };

  /**
   * build locations
   */
  const buildLocations = () => {
    return (
      <>
        <View style={Styles.paddingHorizontalM}>
          <Text typography="callout" fontWeight="bold">
            {translate('popular_location')}
          </Text>
          <SizedBox height={2} />
          <Text typography="caption1" color={theme.colors.text.secondary}>
            {translate('let_find_interesting')}
          </Text>
        </View>
        <FlatList
          data={home?.location ?? Array.from(Array(15).keys())}
          contentContainerStyle={Styles.paddingM}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          renderItem={({item}) => (
            <CategoryItem
              item={item}
              onPress={onCategory}
              type={CategoryViewType.card}
            />
          )}
          ItemSeparatorComponent={SpaceList}
          keyExtractor={(item, index) => `popular${item?.id ?? index}`}
        />
      </>
    );
  };

  /**
   * build recent
   */
  const buildRecent = () => {
    return (
      <View style={Styles.paddingHorizontalM}>
        <Text typography="callout" fontWeight="bold">
          {translate('recent_location')}
        </Text>
        <SizedBox height={2} />
        <Text typography="caption1" color={theme.colors.text.secondary}>
          {translate('what_happen')}
        </Text>
        <SizedBox height={Spacing.S} />
        <ContainerList
          widthSpan={12}
          scrollEnabled={false}
          data={home?.recent ?? Array.from(Array(15).keys())}
          renderItem={({item}) => (
            <ProductItem
              item={item}
              onPress={onProduct}
              type={ProductViewType.small}
            />
          )}
          keyExtractor={(item, index) => `recent${item?.id ?? index}`}
          ListFooterComponent={SpaceList}
        />
      </View>
    );
  };

  return (
    <Screen
      navigation={navigation}
      headerType={'none'}
      style={Styles.flex}
      floatingComponent={
        setting?.enableSubmit && (
          <IconButton
            size={'large'}
            icon={'plus'}
            shape={'rounded'}
            onPress={onSubmit}
          />
        )
      }>
      <Animated.View style={actionStyle}>
        <ImageSlider data={home?.banner} style={styles.sliderContainer} />
        <Pressable style={styles.searchContainer} onPress={onSearch}>
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
        <SizedBox height={Spacing.XS} />
        {buildCategories()}
        <SizedBox height={Spacing.XS} />
        {buildLocations()}
        <SizedBox height={Spacing.XS} />
        {buildRecent()}
      </Animated.ScrollView>
    </Screen>
  );
};

export {HomeBasic};

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
  divider: {position: 'absolute', right: 68, height: 32},
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
