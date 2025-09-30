import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {
  ApplicationContext,
  ContainerList,
  HeaderRightAction,
  IconButton,
  InputSearch,
  NavigationButton,
  Screen,
  ScreenContainerProps,
  SizedBox,
  Spacing,
  Styles,
} from '@passionui/components';

import {useSelector} from 'react-redux';
import {listingActions, listingSelect, settingSelect} from '@redux';
import {CategoryType, FilterModel, ProductModel} from '@models+types';
import {RefreshControl, useWindowDimensions, View} from 'react-native';
import {enableExperimental, getCurrentLocation} from '@utils';
import {Filter, ProductDetail} from '@screens';
import {Empty, ProductItem, ProductViewType, SpaceList} from '@components';
import Assets from '@assets';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {LatLng} from 'react-native-maps/lib/sharedTypes';
import Carousel, {ICarouselInstance} from 'react-native-reanimated-carousel';
import styles from './styles';

const DELTA = {latitudeDelta: 0.0922, longitudeDelta: 0.0421};

const ProductList: React.FC<ScreenContainerProps> = ({
  navigation,
  ...params
}) => {
  const listing = useSelector(listingSelect);
  const setting = useSelector(settingSelect);
  const {width: deviceWidth} = useWindowDimensions();
  const {theme, navigator, translate} = useContext(ApplicationContext);
  const listRef = useRef<ICarouselInstance>(null);
  const mapRef = useRef<MapView>(null);
  const searchRef = useRef('');
  const timer = useRef<any>();
  const filter = useRef(FilterModel.fromSettings(setting));

  const [refreshing, setRefreshing] = useState(false);
  const [pageStyle, setPageStyle] = useState('listing');
  const [modeView, setModeView] = useState<ProductViewType>(
    ProductViewType.list,
  );
  const [heightCarousel, setHeightCarousel] = useState(100);
  const grid = modeView === ProductViewType.grid;

  useEffect(() => {
    if (params.item?.type === CategoryType.category) {
      filter.current.categories = [params.item];
    }
    if (params.item?.type === CategoryType.feature) {
      filter.current.features = [params.item];
    }
    if (params.item?.type === CategoryType.location) {
      filter.current.city = params.item;
    }

    listingActions.onLoadList(filter.current);
    return () => {
      listingActions.onClear();
      clearTimeout(timer.current);
    };
  }, [params.item]);

  /**
   * on refresh
   */
  const onRefresh = async () => {
    setRefreshing(true);
    listingActions.onLoadList(filter.current, () => {
      setRefreshing(false);
    });
  };

  /**
   * on search
   * @param value
   */
  const onSearch = (value: string) => {
    searchRef.current = value;
    filter.current.keyword = value;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      listingActions.onLoadList(filter.current);
    }, 500);
  };

  /**
   * on current location
   */
  const onCurrentLocation = async () => {
    const result = await getCurrentLocation();
    if (result) {
      mapRef.current?.animateToRegion({...result, ...DELTA}, 500);
    }
  };

  /**
   * on press product
   */
  const onPressProduct = (item: ProductModel) => {
    navigator?.push({screen: ProductDetail, item});
  };

  /**
   * change mode view
   */
  const onChangeViewStyle = () => {
    enableExperimental();
    let nextView: ProductViewType;
    switch (modeView) {
      case ProductViewType.list:
        nextView = ProductViewType.block;
        break;
      case ProductViewType.block:
        nextView = ProductViewType.grid;
        break;
      default:
        nextView = ProductViewType.list;
    }
    setModeView(nextView);
  };

  /**
   * on load more
   */
  const onMore = () => {
    if (listing?.pagination?.allowMore) {
      listingActions.onLoadMore();
    }
  };

  /**
   * on filter
   */
  const onFilter = () => {
    navigator?.push({
      screen: Filter,
      item: filter.current,
      onApply: (data: FilterModel) => {
        filter.current = data;
        setTimeout(() => {
          onRefresh().then();
        }, 300);
      },
    });
  };

  /**
   * export icon mode view
   */
  const iconModeView = () => {
    switch (modeView) {
      case ProductViewType.list:
        return 'view-grid-outline';
      case ProductViewType.block:
        return 'view-column-outline';
      case ProductViewType.grid:
        return 'format-list-bulleted';
      default:
        return 'format-list-bulleted';
    }
  };

  /**
   * render data for list
   */
  const data = useMemo(() => {
    if (listing.data) {
      if (listing.pagination.allowMore) {
        let empty = Array.from(Array(1));
        if (grid) {
          empty = Array.from(Array(2));
        }
        return [...listing.data, ...empty];
      }
      return listing.data;
    }
    return Array.from(Array(15).keys());
  }, [listing, grid]);

  /**
   * render content screen
   */
  const renderContent = () => {
    if (pageStyle === 'map') {
      const initLocation = listing.data?.[0]?.gps;
      return (
        <>
          <MapView
            ref={mapRef}
            style={Styles.flex}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            initialRegion={{
              ...DELTA,
              ...initLocation,
            }}>
            {listing.data?.map?.((item: ProductModel) => {
              return <Marker key={item?.id} coordinate={item.gps as LatLng} />;
            })}
          </MapView>
          <View style={styles.carousel}>
            <View style={Styles.paddingHorizontalM}>
              <IconButton
                icon={'crosshairs-gps'}
                onPress={onCurrentLocation}
                size={'medium'}
              />
            </View>
            <Carousel
              ref={listRef}
              vertical={false}
              width={deviceWidth}
              height={heightCarousel}
              loop={true}
              pagingEnabled={true}
              snapEnabled={true}
              autoPlay={false}
              mode="parallax"
              modeConfig={{
                parallaxScrollingScale: 0.9,
                parallaxScrollingOffset: 50,
              }}
              data={listing.data ?? []}
              onSnapToItem={index => {
                const item = listing.data[index];
                mapRef.current?.animateToRegion({...item.gps, ...DELTA}, 500);
              }}
              renderItem={({item}: {item: ProductModel}) => {
                return (
                  <View
                    onLayout={e => {
                      if (heightCarousel !== e.nativeEvent.layout.height) {
                        setHeightCarousel(e.nativeEvent.layout.height);
                      }
                    }}>
                    <ProductItem
                      item={item}
                      onPress={() => onPressProduct(item)}
                      type={modeView}
                      style={[
                        styles.item,
                        {backgroundColor: theme.colors.background.surface},
                      ]}
                    />
                  </View>
                );
              }}
            />
          </View>
        </>
      );
    }

    return (
      <ContainerList
        showsVerticalScrollIndicator={false}
        margin={Spacing.M}
        widthSpan={grid ? 6 : 12}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.text.default}
            title={translate('pull_to_reload')}
            titleColor={theme.colors.text.default}
            colors={[theme.colors.primary.default]}
            progressBackgroundColor={theme.colors.background.surface}
          />
        }
        ListFooterComponent={SpaceList}
        ListEmptyComponent={
          <Empty
            image={Assets.image.empty}
            title={translate('data_not_found')}
            message={translate('please_try_again')}
            action={{title: translate('try_again'), onPress: onRefresh}}
          />
        }
        data={data}
        renderItem={({item}) => {
          return (
            <ProductItem
              item={item}
              onPress={() => onPressProduct(item)}
              type={modeView}
            />
          );
        }}
        keyExtractor={(item, index) => `listing${item?.id ?? index}`}
        onEndReachedThreshold={0.1}
        onEndReached={onMore}
        style={Styles.flex}
      />
    );
  };

  /**
   * header right action
   */
  const headerRight = (props: any) => {
    return (
      <HeaderRightAction {...props}>
        <NavigationButton icon={iconModeView()} onPress={onChangeViewStyle} />
        <NavigationButton
          icon={
            pageStyle === 'listing' ? 'format-list-bulleted' : 'map-outline'
          }
          onPress={() =>
            setPageStyle(pageStyle === 'listing' ? 'map' : 'listing')
          }
        />
      </HeaderRightAction>
    );
  };

  return (
    <Screen
      navigation={navigation}
      options={{
        title: params.item?.title ?? translate('listing'),
        headerRight,
      }}>
      <View style={styles.searchContainer}>
        <View style={Styles.flex}>
          <InputSearch
            placeholder={translate('search')}
            defaultValue={searchRef.current}
            onChangeText={onSearch}
          />
        </View>
        <SizedBox width={Spacing.S} />
        <IconButton
          icon={'filter-outline'}
          onPress={onFilter}
          size={'small'}
          shape={'rounded'}
          type={'outline'}
          color={theme.colors.text.hint}
        />
      </View>
      {renderContent()}
    </Screen>
  );
};

export {ProductList};
