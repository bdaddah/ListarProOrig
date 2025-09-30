import React, {useContext, useRef, useState} from 'react';
import {
  ApplicationContext,
  Badge,
  ContainerList,
  Divider,
  IconButton,
  InputSearch,
  Screen,
  ScreenContainerProps,
  SheetPicker,
  SizedBox,
  Spacing,
  Styles,
  Text,
} from '@passionui/components';
import {blogActions, blogSelect, settingSelect} from '@redux';

import {RefreshControl, View} from 'react-native';
import {BlogItem, BlogViewType, Empty} from '@components';
import Assets from '@assets';
import {useSelector} from 'react-redux';
import {BlogModel, CategoryModel, SortModel} from '@models+types';
import {BlogDetail} from '@screens';
import styles from './styles';

const Blog: React.FC<ScreenContainerProps> = ({navigation}) => {
  const {theme, navigator, translate} = useContext(ApplicationContext);
  const [refreshing, setRefreshing] = useState(false);
  const blog = useSelector(blogSelect);
  const setting = useSelector(settingSelect);
  const category = useRef<CategoryModel>();
  const sort = useRef<SortModel>();
  const keyword = useRef('');

  /**
   * on refresh
   */
  const onRefresh = async () => {
    setRefreshing(true);
    blogActions.onLoad(
      {
        keyword: keyword.current,
        sort: sort.current,
        category: category.current,
      },
      () => {
        setRefreshing(false);
      },
    );
  };

  /**
   * on search
   * @param text
   */
  const onSearch = (text: string) => {
    keyword.current = text;
    blogActions.onLoad({
      keyword: keyword.current,
      sort: sort.current,
      category: category.current,
    });
  };

  /**
   * on change category
   */
  const onChangeSort = () => {
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
              onSearch(keyword.current);
            }}
            renderItem={undefined}
          />
        );
      },
    });
  };

  /**
   * on change category
   */
  const onChangeCategory = () => {
    navigator?.showBottomSheet({
      title: translate('category'),
      screen: () => {
        return (
          <SheetPicker
            data={setting?.category?.map((item: CategoryModel) => {
              return {...item, value: item.id, icon: undefined};
            })}
            selected={{
              title: category.current?.title!,
              value: category.current?.id,
            }}
            onSelect={index => {
              category.current = setting?.category[index];
              navigator?.pop();
              onSearch(keyword.current);
            }}
            renderItem={undefined}
          />
        );
      },
    });
  };

  /**
   * on press blog
   */
  const onPressBlog = (item: BlogModel) => {
    navigator?.push({screen: BlogDetail, item});
  };

  return (
    <Screen
      navigation={navigation}
      options={{statusBarStyle: theme.dark ? 'light' : 'dark'}}
      headerType={'none'}
      edges={['top']}>
      <View style={styles.searchContainer}>
        <View style={Styles.flex}>
          <InputSearch
            size={'large'}
            placeholder={translate('search')}
            useShadow={true}
            onChangeText={onSearch}
          />
        </View>
        <View style={Styles.paddingHorizontalS}>
          <IconButton
            icon={'filter-outline'}
            size={'medium'}
            type={'secondary'}
            onPress={onChangeCategory}
          />
          {category.current && (
            <View style={styles.dot}>
              <Badge type={'dot'} />
            </View>
          )}
        </View>
        <View>
          <IconButton
            icon={'sort'}
            size={'medium'}
            type={'secondary'}
            onPress={onChangeSort}
          />
          {sort.current && (
            <View style={styles.dot}>
              <Badge type={'dot'} />
            </View>
          )}
        </View>
      </View>
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
        ListHeaderComponent={
          <>
            <BlogItem
              item={blog.sticky}
              onPress={onPressBlog}
              type={BlogViewType.sticky}
            />
            <SizedBox height={Spacing.M} />
            <Divider />
            <Text
              typography={'headline'}
              fontWeight={'bold'}
              style={Styles.paddingVerticalM}>
              {translate('latest_new')}
            </Text>
          </>
        }
        ListEmptyComponent={
          <Empty
            image={Assets.image.empty}
            title={translate('data_not_found')}
            message={translate('please_try_again')}
            action={{title: translate('try_again'), onPress: onRefresh}}
          />
        }
        data={blog.list ?? Array.from(Array(15).keys())}
        renderItem={({item}) => {
          return (
            <BlogItem
              item={item}
              onPress={onPressBlog}
              type={BlogViewType.list}
            />
          );
        }}
        keyExtractor={(item, index) => `blog${item?.id ?? index}`}
        style={Styles.flex}
      />
    </Screen>
  );
};

export {Blog};
