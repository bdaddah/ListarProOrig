import {
  FlatList,
  RefreshControl,
  Share,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {
  ApplicationContext,
  Divider,
  Icon,
  IconButton,
  InputSearch,
  SheetPicker,
  SizedBox,
  Spacing,
  Styles,
  Tag,
} from '@passionui/components';
import {
  Empty,
  ListTitle,
  ProductItem,
  ProductViewType,
  SpaceList,
} from '@components';
import {FilterModel, ProductModel, SortModel} from '@models+types';
import Assets from '@assets';
import {listingActions, settingSelect} from '@redux';
import {useSelector} from 'react-redux';
import {Authentication, Booking, Claim, Filter, SubmitListing} from '@screens';

type ListingAuthorProps = {
  onProduct: (item: ProductModel) => void;
  onLoadListing: (
    filter: FilterModel,
    params: any,
    callback: (data: any) => void,
  ) => void;
  owner: boolean;
  pending?: boolean;
};

const ListingAuthor: React.FC<ListingAuthorProps> = ({
  onProduct,
  pending = false,
  onLoadListing,
  owner,
}) => {
  const {translate, navigator, theme} = useContext(ApplicationContext);
  const setting = useSelector(settingSelect);
  const [refreshing, setRefreshing] = useState(false);
  const [result, setResult] = useState<any>();
  const filter = useRef(FilterModel.fromSettings(setting));
  const keyword = useRef('');
  const timer = useRef<any>(null);

  useEffect(() => {
    onLoadListing(filter.current, {page: 1, pending}, setResult);
    return () => {
      clearTimeout(timer.current);
    };
  }, [onLoadListing, pending]);

  /**
   * on refresh
   */
  const onRefresh = async () => {
    setRefreshing(true);
    onLoadListing(
      filter.current,
      {page: 1, pending, keyword: keyword.current},
      (value: any) => {
        setRefreshing(false);
        setResult(value);
      },
    );
  };

  /**
   * on search
   */
  const onSearch = (text: string) => {
    keyword.current = text;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      onLoadListing(
        filter.current,
        {page: 1, pending, keyword: keyword.current},
        setResult,
      );
    }, 500);
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
   * on sort listing
   */
  const onSort = () => {
    navigator?.showBottomSheet({
      title: translate('sort'),
      screen: () => {
        return (
          <SheetPicker
            data={setting?.sort?.map((item: SortModel) => {
              return {...item, title: translate(item.title)};
            })}
            selected={filter.current.sort}
            onSelect={index => {
              filter.current.sort = setting?.sort[index];
              navigator?.pop();
              onRefresh().then();
            }}
            renderItem={undefined}
          />
        );
      },
    });
  };

  /**
   * on more
   */
  const onMore = () => {
    if (result?.pagination?.allowMore) {
      onLoadListing(
        filter.current,
        {
          page: result.pagination.page + 1,
          pending,
        },
        (value: any) => {
          setResult({
            ...result,
            data: [...result.data, ...value.data],
            pagination: value.pagination,
          });
        },
      );
    }
  };

  /**
   * on action
   * @param item
   */
  const onAction = (item: ProductModel) => {
    /**
     * on submit listing
     */
    const onEdit = () => {
      navigator?.pop();
      navigator?.push({
        screen: props => <Authentication {...props} screen={SubmitListing} />,
        item,
      });
    };

    /**
     * on claim item
     */
    const onClaim = () => {
      navigator?.pop();
      navigator?.push({
        screen: props => <Authentication {...props} screen={Claim} />,
        item,
      });
    };

    /**
     * on delete wishlist
     */
    const onDelete = () => {
      listingActions.onDelete(item, onRefresh);
      navigator?.pop();
    };

    /**
     * on share
     */
    const onShare = async () => {
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
     * on booking item
     */
    const onBooking = () => {
      navigator?.pop();
      navigator?.push({
        screen: props => <Authentication {...props} screen={Booking} />,
        item,
      });
    };

    navigator?.showBottomSheet({
      title: translate('profile'),
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
                  onPress={onBooking}
                />
                <Divider style={{marginVertical: Spacing.XS}} />
              </>
            )}
            {item?.useClaim && (
              <>
                <ListTitle
                  title={translate('claim')}
                  leading={<Icon name="shield-check-outline" />}
                  onPress={onClaim}
                />
                <Divider style={{marginVertical: Spacing.XS}} />
              </>
            )}
            {owner && (
              <>
                <ListTitle
                  title={translate('edit')}
                  leading={<Icon name="pencil-outline" />}
                  onPress={onEdit}
                />
                <Divider style={{marginVertical: Spacing.XS}} />
                <ListTitle
                  title={translate('delete')}
                  leading={<Icon name="delete-outline" />}
                  onPress={onDelete}
                />
                <Divider style={{marginVertical: Spacing.XS}} />
              </>
            )}
            <ListTitle
              title={translate('share')}
              leading={<Icon name="share-outline" />}
              onPress={onShare}
            />
          </View>
        );
      },
    });
  };

  /**
   * render data for list
   */
  const data = useMemo(() => {
    if (result?.data) {
      if (result.pagination.allowMore) {
        return [...result.data, ...[{}]];
      }
      return result.data;
    }
    return Array.from(Array(15).keys());
  }, [result]);

  return (
    <>
      <View style={Styles.paddingM}>
        <InputSearch
          placeholder={translate('search')}
          defaultValue={keyword.current}
          onChangeText={onSearch}
        />
        <SizedBox height={Spacing.M} />
        <View style={Styles.row}>
          {!pending && (
            <>
              <TouchableOpacity onPress={onFilter}>
                <Tag
                  label={translate('filter')}
                  size={'medium'}
                  icon={'filter-outline'}
                />
              </TouchableOpacity>
              <SizedBox width={Spacing.M} />
            </>
          )}
          <TouchableOpacity onPress={onSort}>
            <Tag
              size={'medium'}
              label={translate('sort')}
              icon={'sort-reverse-variant'}
            />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
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
        contentContainerStyle={Styles.paddingHorizontalM}
        data={data}
        renderItem={({item}) => (
          <View style={Styles.row}>
            <ProductItem
              item={item}
              onPress={() => onProduct(item)}
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
        )}
        keyExtractor={(item, index) => `listing${item?.id ?? index}`}
        ItemSeparatorComponent={SpaceList}
        onEndReachedThreshold={0.1}
        onEndReached={onMore}
      />
    </>
  );
};

export {ListingAuthor};
