import {FlatList, RefreshControl, TouchableOpacity, View} from 'react-native';
import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {CommentItem, Empty, SpaceList} from '@components';
import Assets from '@assets';
import {
  ApplicationContext,
  InputSearch,
  SheetPicker,
  SizedBox,
  Spacing,
  Styles,
  Tag,
} from '@passionui/components';
import {SortModel} from '@models+types';
import {useSelector} from 'react-redux';
import {settingSelect} from '@redux';

type ReviewAuthorProps = {
  onLoadReview: (params: any, callback: (data: any) => void) => void;
};

const ReviewAuthor: React.FC<ReviewAuthorProps> = ({onLoadReview}) => {
  const setting = useSelector(settingSelect);
  const {theme, navigator, translate} = useContext(ApplicationContext);
  const [refreshing, setRefreshing] = useState(false);
  const [result, setResult] = useState<any>();
  const keyword = useRef('');
  const sort = useRef();
  const timer = useRef<any>(null);

  useEffect(() => {
    onLoadReview({page: 1, sort: sort.current}, setResult);
  }, [onLoadReview]);

  /**
   * on refresh
   */
  const onRefresh = async () => {
    setRefreshing(true);
    onLoadReview(
      {page: 1, keyword: keyword.current, sort: sort.current},
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
      onLoadReview(
        {page: 1, keyword: keyword.current, sort: sort.current},
        setResult,
      );
    }, 500);
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
            selected={sort.current}
            onSelect={index => {
              sort.current = setting?.sort[index];
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
      onLoadReview(
        {
          page: result.pagination.page + 1,
          keyword: keyword.current,
          sort: sort.current,
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
    <View>
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
            title={translate('data_not_found')}
            message={translate('please_try_again')}
            action={{title: translate('try_again'), onPress: onRefresh}}
          />
        }
        ItemSeparatorComponent={SpaceList}
        data={data}
        renderItem={({item}) => {
          return <CommentItem item={item} />;
        }}
        contentContainerStyle={Styles.paddingHorizontalM}
        keyExtractor={(item, index) => `review${item?.id}${index}`}
        onEndReachedThreshold={0.1}
        onEndReached={onMore}
      />
    </View>
  );
};

export {ReviewAuthor};
