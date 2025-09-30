import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {
  ApplicationContext,
  Divider,
  InputSearch,
  Screen,
  ScreenContainerProps,
  SheetPicker,
  SizedBox,
  Spacing,
  Styles,
  Tag,
} from '@passionui/components';
import {FlatList, RefreshControl, TouchableOpacity, View} from 'react-native';
import {ClaimItem, Empty} from '@components';
import Assets from '@assets';
import {ClaimModel, SortModel} from '@models+types';
import {claimActions} from '@redux';
import {ClaimDetail} from '@screens';

const ClaimManagement: React.FC<ScreenContainerProps> = ({navigation}) => {
  const {translate, navigator, theme} = useContext(ApplicationContext);
  const [refreshing, setRefreshing] = useState(false);
  const [result, setResult] = useState<any>();
  const status = useRef<SortModel>();
  const sort = useRef<SortModel>();
  const keyword = useRef('');
  const timer = useRef<any>();

  useEffect(() => {
    claimActions.onLoadList({page: 1}, status.current, sort.current, setResult);
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  /**
   * on detail
   * @param item
   */
  const onDetail = (item: ClaimModel) => {
    navigator?.push({screen: ClaimDetail, item});
  };

  /**
   * on refresh
   */
  const onRefresh = async () => {
    setRefreshing(true);
    claimActions.onLoadList(
      {page: 1, keyword: keyword.current},
      status.current,
      sort.current,
      data => {
        setResult(data);
        setRefreshing(false);
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
      claimActions.onLoadList(
        {page: 1, keyword: keyword.current},
        status.current,
        sort.current,
        data => {
          setResult(data);
        },
      );
    }, 500);
  };

  /**
   * on filter
   */
  const onFilter = () => {
    navigator?.showBottomSheet({
      title: translate('status'),
      screen: () => {
        return (
          <SheetPicker
            data={result.status?.map((item: SortModel) => {
              return {...item, title: translate(item.title)};
            })}
            selected={status.current}
            onSelect={index => {
              status.current = result.status[index];
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
   * on sort
   */
  const onSort = () => {
    navigator?.showBottomSheet({
      title: translate('sort'),
      screen: () => {
        return (
          <SheetPicker
            data={result.sort?.map((item: SortModel) => {
              return {...item, title: translate(item.title)};
            })}
            selected={sort.current}
            onSelect={index => {
              sort.current = result.sort[index];
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
   * on load more
   */
  const onMore = () => {
    if (result?.pagination?.allowMore) {
      claimActions.onLoadList(
        {page: result?.pagination.page + 1, keyword: keyword.current},
        status.current,
        sort.current,
        value => {
          setResult({
            ...result,
            data: [...result.data, value.data],
            pagination: result.pagination,
          });
        },
      );
    }
  };

  /**
   * render data for list
   */
  const data = useMemo(() => {
    if (result) {
      if (result.pagination.allowMore) {
        return [...result.data, ...[{}]];
      }
      return result.data;
    }
    return Array.from(Array(15).keys());
  }, [result]);

  return (
    <Screen
      navigation={navigation}
      options={{title: translate('claim_management')}}>
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
              label={translate('status')}
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
        ItemSeparatorComponent={Divider}
        data={data}
        renderItem={({item}) => {
          return <ClaimItem item={item} onPress={onDetail} />;
        }}
        keyExtractor={(item, index) => `wishlist${item?.id ?? index}`}
        onEndReachedThreshold={0.1}
        onEndReached={onMore}
        style={Styles.flex}
        contentContainerStyle={[
          Styles.paddingHorizontalM,
          {backgroundColor: theme.colors.background.surface},
        ]}
      />
    </Screen>
  );
};

export {ClaimManagement};
