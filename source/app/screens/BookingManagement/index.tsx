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
  TabView,
  TabViewRef,
  Tag,
} from '@passionui/components';
import {FlatList, RefreshControl, TouchableOpacity, View} from 'react-native';
import {bookingActions} from '@redux';
import {BookingModel, SortModel} from '@models+types';
import {BookingItem, Empty} from '@components';
import Assets from '@assets';
import {BookingDetail} from '../BookingDetail';

const BookingManagement: React.FC<ScreenContainerProps> = ({navigation}) => {
  const {translate} = useContext(ApplicationContext);
  const tabRef = useRef<TabViewRef>();

  const tabs = [
    {
      label: translate('my_booking'),
      content: <BookingList request={false} />,
    },
    {
      label: translate('request_booking'),
      content: <BookingList request={true} />,
    },
  ];

  return (
    <Screen
      navigation={navigation}
      options={{title: translate('booking_management')}}>
      <TabView
        ref={tabRef}
        tabs={tabs}
        direction={'row'}
        style={Styles.flex}
        initialIndex={0}
      />
    </Screen>
  );
};

const BookingList: React.FC<{request: boolean}> = ({request = false}) => {
  const {translate, navigator, theme} = useContext(ApplicationContext);
  const [refreshing, setRefreshing] = useState(false);
  const [result, setResult] = useState<any>();
  const status = useRef<SortModel>();
  const sort = useRef<SortModel>();
  const keyword = useRef('');
  const timer = useRef<any>(null);

  useEffect(() => {
    bookingActions.onLoadList(
      {page: 1},
      status.current,
      sort.current,
      request,
      setResult,
    );

    return () => {
      clearTimeout(timer.current);
    };
  }, [request]);

  /**
   * on detail
   */
  const onDetail = (item: BookingModel) => {
    navigator?.push({screen: BookingDetail, item});
  };

  /**
   * on refresh
   */
  const onRefresh = async () => {
    setRefreshing(true);
    bookingActions.onLoadList(
      {page: 1, keyword: keyword.current},
      status.current,
      sort.current,
      request,
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
      bookingActions.onLoadList(
        {page: 1, keyword: keyword.current},
        status.current,
        sort.current,
        request,
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
   * on sort listing
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
      bookingActions.onLoadList(
        {page: result?.pagination.page + 1, keyword: keyword.current},
        status.current,
        sort.current,
        request,
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
    <>
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
          return <BookingItem item={item} onPress={onDetail} />;
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
    </>
  );
};

export {BookingManagement};
