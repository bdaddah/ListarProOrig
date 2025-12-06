import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {
  ApplicationContext,
  Button,
  Colors,
  Divider,
  Icon,
  InputSearch,
  Popup,
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
  TouchableOpacity,
  View,
} from 'react-native';
import {listingActions, settingSelect} from '@redux';
import {FilterModel, ProductModel, SortModel} from '@models+types';
import {Empty, ListTitle, ProductItem, ProductViewType, SpaceList} from '@components';
import Assets from '@assets';
import {useSelector} from 'react-redux';
import {Filter, ProductDetail} from '@screens';
import styles from './styles';

const AdminModeration: React.FC<ScreenContainerProps> = ({navigation}) => {
  const {translate, navigator, theme} = useContext(ApplicationContext);
  const setting = useSelector(settingSelect);
  const [refreshing, setRefreshing] = useState(false);
  const [result, setResult] = useState<any>();
  const filter = useRef(FilterModel.fromSettings(setting));
  const keyword = useRef('');
  const timer = useRef<any>(null);

  useEffect(() => {
    listingActions.onLoadPendingListings(filter.current, {page: 1}, setResult);
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const onProduct = (item: ProductModel) => {
    navigator?.push({screen: ProductDetail, item});
  };

  const onRefresh = async () => {
    setRefreshing(true);
    listingActions.onLoadPendingListings(
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
      listingActions.onLoadPendingListings(
        filter.current,
        {page: 1, keyword: keyword.current},
        setResult,
      );
    }, 500);
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
      listingActions.onLoadPendingListings(
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

  const onApprove = (item: ProductModel) => {
    navigator?.showModal({
      screen: () => (
        <Popup
          title={translate('approve')}
          description={translate('confirm_approve_listing')}
          primary={{
            title: translate('yes'),
            onPress: () => {
              listingActions.onUpdateListingStatus(item.id, 'publish', (success) => {
                if (success) {
                  onRefresh();
                }
              });
            },
          }}
          secondary={{
            title: translate('close'),
            onPress: () => {},
          }}
        />
      ),
    });
  };

  const onReject = (item: ProductModel) => {
    navigator?.showModal({
      screen: () => (
        <Popup
          title={translate('reject')}
          description={translate('confirm_reject_listing')}
          primary={{
            title: translate('yes'),
            onPress: () => {
              listingActions.onUpdateListingStatus(item.id, 'draft', (success) => {
                if (success) {
                  onRefresh();
                }
              });
            },
          }}
          secondary={{
            title: translate('close'),
            onPress: () => {},
          }}
        />
      ),
    });
  };

  const onAction = (item: ProductModel) => {
    navigator?.showBottomSheet({
      title: translate('moderation'),
      snapPoint: 'content',
      backgroundColor: theme.colors.background.surface,
      screen: () => {
        return (
          <View style={Styles.paddingHorizontalM}>
            <ListTitle
              title={translate('approve')}
              leading={<Icon name="check-circle-outline" color={Colors.green_04} />}
              onPress={() => {
                navigator?.pop();
                onApprove(item);
              }}
            />
            <Divider style={{marginVertical: Spacing.XS}} />
            <ListTitle
              title={translate('reject')}
              leading={<Icon name="close-circle-outline" color={Colors.red_04} />}
              onPress={() => {
                navigator?.pop();
                onReject(item);
              }}
            />
            <Divider style={{marginVertical: Spacing.XS}} />
            <ListTitle
              title={translate('view_details')}
              leading={<Icon name="eye-outline" />}
              onPress={() => {
                navigator?.pop();
                onProduct(item);
              }}
            />
          </View>
        );
      },
    });
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
      options={{title: translate('pending_listings')}}>
      <View style={Styles.paddingM}>
        <InputSearch
          placeholder={translate('search')}
          defaultValue={keyword.current}
          onChangeText={onSearch}
        />
        <SizedBox height={Spacing.M} />
        <View style={Styles.row}>
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
            title={translate('no_pending_listings')}
            message={translate('all_listings_reviewed')}
            action={{title: translate('refresh'), onPress: onRefresh}}
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
            </View>
            {!!item?.id && (
              <View style={styles.actionContainer}>
                <Button
                  title={translate('approve')}
                  type={'primary'}
                  size={'small'}
                  onPress={() => onApprove(item)}
                  style={styles.approveButton}
                />
                <SizedBox width={Spacing.S} />
                <Button
                  title={translate('reject')}
                  type={'secondary'}
                  size={'small'}
                  onPress={() => onReject(item)}
                  style={styles.rejectButton}
                />
                <SizedBox width={Spacing.S} />
                <TouchableOpacity onPress={() => onAction(item)}>
                  <Icon name="dots-vertical" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        keyExtractor={(item, index) => `pendingListing${item?.id ?? index}`}
        ItemSeparatorComponent={SpaceList}
        onEndReachedThreshold={0.1}
        onEndReached={onMore}
      />
    </Screen>
  );
};

export {AdminModeration};
