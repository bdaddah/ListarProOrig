import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {FlatList, RefreshControl, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {
  ApplicationContext,
  HeaderRightAction,
  InputSearch,
  NavigationButton,
  Screen,
  ScreenContainerProps,
  Styles,
  Tag,
} from '@passionui/components';
import {searchActions, searchSelect} from '@redux';
import {ProductModel} from '@models+types';
import {Empty, ProductItem, ProductViewType, SpaceList} from '@components';
import Assets from '@assets';
import styles from './styles';
import {ProductDetail} from '@screens';

const Search: React.FC<ScreenContainerProps> = ({navigation}) => {
  const {theme, navigator, translate} = useContext(ApplicationContext);
  const search = useSelector(searchSelect);
  const keyword = useRef('');
  const [refreshing, setRefreshing] = useState(false);

  /**
   * on refresh
   */
  const onRefresh = async () => {
    if (keyword.current !== '') {
      setRefreshing(true);
      searchActions.onSearch({keyword: keyword.current}, () =>
        setRefreshing(false),
      );
    }
  };

  useEffect(() => {
    return () => {
      searchActions.onReset();
    };
  }, []);

  /**
   * handle searching
   * @param value
   */
  const onChangeText = (value: string) => {
    keyword.current = value;
    if (keyword.current === '') {
      searchActions.onReset();
    } else {
      searchActions.onSearch({keyword: keyword.current});
    }
  };

  /**
   * on press product
   */
  const onPressProduct = (item: ProductModel) => {
    navigator?.push({screen: ProductDetail, item});
    if (!search.history?.some?.((i: ProductModel) => i.id === item.id)) {
      searchActions.onAddHistory(item);
    }
  };

  /**
   * on clear search history
   */
  const onClear = () => {
    searchActions.onClearHistory();
  };

  /**
   * on load more
   */
  const onMore = () => {
    if (search?.pagination?.allowMore) {
      searchActions.onLoadMore({keyword});
    }
  };

  const data = useMemo(() => {
    if (search.data) {
      if (search.pagination?.allowMore) {
        return [...search.data, ...[{}]];
      }
      return search.data;
    }
    return Array.from(Array(15).keys());
  }, [search]);

  const headerRight = useCallback(
    (props: any) => {
      if (search.history) {
        return (
          <HeaderRightAction {...props}>
            <NavigationButton icon={'trash-can-outline'} onPress={onClear} />
          </HeaderRightAction>
        );
      }
    },
    [search.history],
  );

  return (
    <Screen
      navigation={navigation}
      edges={['bottom']}
      options={{
        title: translate('search_title'),
        headerRight,
      }}>
      <View style={Styles.paddingM}>
        <InputSearch
          defaultValue={keyword.current}
          placeholder={translate('search')}
          onChangeText={onChangeText}
        />
      </View>
      <FlatList
        data={data}
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
        renderItem={({item}) => {
          return (
            <ProductItem
              item={item}
              onPress={() => onPressProduct(item)}
              type={ProductViewType.small}
            />
          );
        }}
        ListEmptyComponent={
          <>
            <View style={styles.listHistory}>
              {search.history?.map?.((item: ProductModel) => {
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => onPressProduct(item)}>
                    <Tag label={item.title} size={'large'} />
                  </TouchableOpacity>
                );
              })}
            </View>
            <Empty
              image={Assets.image.empty}
              title={translate('data_not_found')}
              message={translate('please_try_again')}
              action={{
                title: translate('try_again'),
                onPress: onRefresh,
              }}
            />
          </>
        }
        ItemSeparatorComponent={SpaceList}
        keyExtractor={(item, index) => `search${item?.id}${index}`}
        onEndReachedThreshold={0.1}
        onEndReached={onMore}
        contentContainerStyle={styles.list}
        style={Styles.flex}
      />
    </Screen>
  );
};

export {Search};
