import React, {useContext, useState} from 'react';
import {
  ApplicationContext,
  Button,
  Icon,
  InputSearch,
  Screen,
  ScreenContainerProps,
  SizedBox,
  Spacing,
  Styles,
  Text,
} from '@passionui/components';

import {FlatList, Pressable, RefreshControl, View} from 'react-native';
import {useSelector} from 'react-redux';
import {discoveryActions, discoverySelect} from '@redux';
import {CategoryModel, ProductModel} from '@models+types';
import {Empty, ProductItem, ProductViewType, SpaceList} from '@components';
import styles from './styles';
import {convertIcon} from '@utils';
import Assets from '@assets';
import {Category, ProductDetail, ProductList, Search} from '@screens';

const Discovery: React.FC<ScreenContainerProps> = ({navigation, options}) => {
  const {theme, navigator, translate} = useContext(ApplicationContext);
  const [refreshing, setRefreshing] = useState(false);
  const discovery = useSelector(discoverySelect);

  /**
   * on refresh
   */
  const onRefresh = async () => {
    setRefreshing(true);
    discoveryActions.onLoad(() => {
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
   * on press category
   */
  const onPressCategory = (item: CategoryModel) => {
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
  const onPressProduct = (item: ProductModel) => {
    navigator?.push({screen: ProductDetail, item});
  };

  /**
   * render item list
   */
  /**
   * render item
   * @param item
   * @returns {JSX.Element}
   */
  const renderItem = ({item}: any): JSX.Element => {
    return (
      <View>
        <View style={[Styles.row, Styles.paddingHorizontalM]}>
          <View style={[styles.icon, {backgroundColor: item.category?.color}]}>
            <Icon
              name={convertIcon(item.category?.icon!)}
              size={18}
              color="white"
              type="FontAwesome5"
            />
          </View>
          <SizedBox width={Spacing.S} />
          <View style={Styles.flex}>
            <Text typography="subhead" fontWeight="bold">
              {item.category?.title}
            </Text>
            <SizedBox height={Spacing.XXS} />
            <Text typography="caption2">
              {item.category?.count} {translate('location')}
            </Text>
          </View>
          <Button
            full={false}
            title={translate('see_more')}
            type={'text'}
            size={'small'}
            onPress={() => onPressCategory(item)}
          />
        </View>
        <FlatList
          style={Styles.paddingVerticalS}
          data={item.list}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({item: product}: {item: ProductModel}) => {
            return (
              <ProductItem
                item={product}
                type={ProductViewType.card}
                onPress={onPressProduct}
                style={styles.item}
              />
            );
          }}
          ItemSeparatorComponent={SpaceList}
          contentContainerStyle={Styles.paddingHorizontalM}
          keyExtractor={(i, index) => `product${i?.id ?? index}`}
        />
      </View>
    );
  };

  return (
    <Screen
      navigation={navigation}
      headerType={'none'}
      edges={['top']}
      options={{
        ...options,
        title: translate('discovery'),
        statusBarStyle: theme.dark ? 'light' : 'dark',
      }}>
      <Pressable style={styles.searchContainer} onPress={onSearch}>
        <InputSearch
          value={translate('search_location')}
          editable={false}
          onPress={onSearch}
          size={'large'}
          useShadow={true}
        />
      </Pressable>
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
        data={discovery}
        renderItem={renderItem}
        keyExtractor={(item, index) => `discovery${item?.id}${index}`}
        contentContainerStyle={Styles.paddingVerticalS}
        style={Styles.flex}
      />
    </Screen>
  );
};

export {Discovery};
