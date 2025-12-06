import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {
  ApplicationContext,
  Colors,
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
  Tag,
  Text,
} from '@passionui/components';
import {
  FlatList,
  RefreshControl,
  Share,
  TouchableOpacity,
  View,
} from 'react-native';
import {listingActions, settingSelect} from '@redux';
import {FilterModel, ProductModel, SortModel} from '@models+types';
import {Empty, ListTitle, ProductItem, ProductViewType, SpaceList} from '@components';
import Assets from '@assets';
import {useSelector} from 'react-redux';
import {Authentication, Filter, ProductDetail, SubmitListing} from '@screens';
import styles from './styles';

const MyListings: React.FC<ScreenContainerProps> = ({navigation}) => {
  const {translate, navigator, theme} = useContext(ApplicationContext);
  const setting = useSelector(settingSelect);
  const [refreshing, setRefreshing] = useState(false);
  const [result, setResult] = useState<any>();
  const filter = useRef(FilterModel.fromSettings(setting));
  const keyword = useRef('');
  const timer = useRef<any>(null);

  useEffect(() => {
    listingActions.onLoadMyListings(filter.current, {page: 1}, setResult);
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const onProduct = (item: ProductModel) => {
    navigator?.push({screen: ProductDetail, item});
  };

  const onRefresh = async () => {
    setRefreshing(true);
    listingActions.onLoadMyListings(
      filter.current,
      {page: 1, keyword: keyword.current},
      (value: any) => {
        setRefreshing(false);
        setResult(value);
      },
    );
  };

  const onSearch = (text: string) => {
    keyword.current = text;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      listingActions.onLoadMyListings(
        filter.current,
        {page: 1, keyword: keyword.current},
        setResult,
      );
    }, 500);
  };

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

  const onMore = () => {
    if (result?.pagination?.allowMore) {
      listingActions.onLoadMyListings(
        filter.current,
        {
          page: result.pagination.page + 1,
          keyword: keyword.current,
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

  const onAction = (item: ProductModel) => {
    const onEdit = () => {
      navigator?.pop();
      navigator?.push({
        screen: props => <Authentication {...props} screen={SubmitListing} />,
        item,
      });
    };

    const onDelete = () => {
      listingActions.onDelete(item, onRefresh);
      navigator?.pop();
    };

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

    navigator?.showBottomSheet({
      title: translate('actions'),
      snapPoint: 'content',
      backgroundColor: theme.colors.background.surface,
      screen: () => {
        return (
          <View style={Styles.paddingHorizontalM}>
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'publish':
        return Colors.green_04;
      case 'pending':
        return Colors.gold_04;
      case 'draft':
        return Colors.grey_04;
      default:
        return Colors.grey_04;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'publish':
        return translate('listing_status_publish');
      case 'pending':
        return translate('listing_status_pending');
      case 'draft':
        return translate('listing_status_draft');
      default:
        return status;
    }
  };

  const data = useMemo(() => {
    if (result?.data) {
      if (result.pagination?.allowMore) {
        return [...result.data, ...[{}]];
      }
      return result.data;
    }
    return Array.from(Array(15).keys());
  }, [result]);

  return (
    <Screen
      navigation={navigation}
      options={{title: translate('my_listings')}}>
      <View style={Styles.paddingM}>
        <InputSearch
          placeholder={translate('search')}
          defaultValue={keyword.current}
          onChangeText={onSearch}
        />
        <SizedBox height={Spacing.M} />
        <View style={Styles.row}>
          <TouchableOpacity onPress={onFilter}>
            <Tag
              label={translate('filter')}
              size={'medium'}
              icon={'filter-outline'}
            />
          </TouchableOpacity>
          <SizedBox width={Spacing.M} />
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
          <View>
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
            {!!item?.status && (
              <View style={styles.statusContainer}>
                <View
                  style={[
                    styles.statusBadge,
                    {backgroundColor: Colors.lighten(getStatusColor(item.status), 32)},
                  ]}>
                  <Text
                    style={[styles.statusText, {color: getStatusColor(item.status)}]}>
                    {getStatusLabel(item.status)}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
        keyExtractor={(item, index) => `myListing${item?.id ?? index}`}
        ItemSeparatorComponent={SpaceList}
        onEndReachedThreshold={0.1}
        onEndReached={onMore}
      />
    </Screen>
  );
};

export {MyListings};
