import React, {useCallback, useContext, useMemo, useState} from 'react';
import {
  ApplicationContext,
  ContainerList,
  Divider,
  HeaderRightAction,
  Icon,
  IconButton,
  NavigationButton,
  Screen,
  ScreenContainerProps,
  SizedBox,
  Spacing,
  Styles,
} from '@passionui/components';

import {RefreshControl, Share, View} from 'react-native';
import {useSelector} from 'react-redux';
import {wishlistActions, wishlistSelect} from '@redux';
import {ProductModel} from '@models+types';
import {Empty, ListTitle, ProductItem, ProductViewType} from '@components';
import styles from './styles';
import Assets from '@assets';
import {Authentication, Booking, Claim, ProductDetail} from '@screens';

const WishList: React.FC<ScreenContainerProps> = ({navigation, options}) => {
  const {theme, navigator, translate} = useContext(ApplicationContext);
  const [refreshing, setRefreshing] = useState(false);
  const wishlist = useSelector(wishlistSelect);

  /**
   * on refresh
   */
  const onRefresh = async () => {
    setRefreshing(true);
    wishlistActions.onLoad(() => {
      setRefreshing(false);
    });
  };

  /**
   * on press product
   */
  const onPressProduct = (item: ProductModel) => {
    navigator?.push({screen: ProductDetail, item});
  };

  /**
   * on clear wishlist
   */
  const onClear = () => {
    wishlistActions.onClear();
  };

  /**
   * on booking item
   */
  const onBooking = (item: ProductModel) => {
    navigator?.pop();
    navigator?.push({
      screen: props => <Authentication {...props} screen={Booking} />,
      item,
    });
  };

  /**
   * on claim item
   */
  const onClaim = (item: ProductModel) => {
    navigator?.pop();
    navigator?.push({
      screen: props => <Authentication {...props} screen={Claim} />,
      item,
    });
  };

  /**
   * on delete wishlist
   */
  const onDelete = (item: ProductModel) => {
    navigator?.pop();
    wishlistActions.onDeleted(item);
  };

  /**
   * on share
   */
  const onShare = async (item: ProductModel) => {
    navigator?.pop();
    try {
      await Share.share({
        url: item.link,
        title: item.title,
        message: `Check out my item ${item.link}`,
      });
    } catch (error: any) {
      navigator?.showToast({
        message: error.message,
        type: 'warning',
      });
    }
  };

  /**
   * on load more
   */
  const onMore = () => {
    if (wishlist?.pagination?.allowMore) {
      wishlistActions.onLoadMore();
    }
  };

  /**
   * on action
   * @param item
   */
  const onAction = (item: ProductModel) => {
    navigator?.showBottomSheet({
      title: translate('wish_list'),
      snapPoint: 'content',
      backgroundColor: theme.colors.background.surface,
      screen: () => {
        return (
          <View style={Styles.paddingHorizontalM}>
            {item?.priceDisplay && (
              <>
                <ListTitle
                  title={translate('booking')}
                  leading={<Icon name="bookmark-outline" />}
                  onPress={() => onBooking(item)}
                />
                <Divider style={{marginVertical: Spacing.XS}} />
              </>
            )}
            {item?.useClaim && (
              <>
                <ListTitle
                  title={translate('claim')}
                  leading={<Icon name="shield-check-outline" />}
                  onPress={() => onClaim(item)}
                />
                <Divider style={{marginVertical: Spacing.XS}} />
              </>
            )}
            <ListTitle
              title={translate('share')}
              leading={<Icon name="share-outline" />}
              onPress={() => onShare(item)}
            />
            <Divider style={{marginVertical: Spacing.XS}} />
            <ListTitle
              title={translate('delete')}
              leading={<Icon name="delete-outline" />}
              onPress={() => onDelete(item)}
            />
          </View>
        );
      },
    });
  };

  /**
   * render item list
   */
  const renderItem = ({item}: {item: ProductModel}) => {
    return (
      <View style={styles.item}>
        <ProductItem
          item={item}
          onPress={() => onPressProduct(item)}
          type={ProductViewType.small}
          style={Styles.flex}
        />
        <SizedBox width={Spacing.XS} />
        {!!item?.id && (
          <IconButton
            onPress={() => onAction(item)}
            icon={'dots-vertical'}
            type={'secondary'}
            size={'medium'}
          />
        )}
      </View>
    );
  };

  /**
   * render data for list
   */
  const data = useMemo(() => {
    if (wishlist.data) {
      if (wishlist.pagination.allowMore) {
        return [...wishlist.data, ...[{}]];
      }
      return wishlist.data;
    }
    return Array.from(Array(15).keys());
  }, [wishlist]);

  const headerRight = useCallback((props: any) => {
    return (
      <HeaderRightAction {...props}>
        <NavigationButton icon={'trash-can-outline'} onPress={onClear} />
      </HeaderRightAction>
    );
  }, []);

  return (
    <Screen
      navigation={navigation}
      options={{
        ...options,
        title: translate('wish_list'),
        headerRight,
      }}>
      <ContainerList
        padding={Spacing.M}
        widthSpan={12}
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
        ListEmptyComponent={
          <Empty
            image={Assets.image.empty}
            title={translate('data_not_found')}
            message={translate('please_try_again')}
            action={{title: translate('try_again'), onPress: onRefresh}}
          />
        }
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => `wishlist${item?.id ?? index}`}
        onEndReachedThreshold={0.1}
        onEndReached={onMore}
        style={Styles.flex}
      />
    </Screen>
  );
};

export {WishList};
