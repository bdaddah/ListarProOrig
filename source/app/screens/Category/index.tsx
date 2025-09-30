import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import {FlatList, RefreshControl, View} from 'react-native';
import {enableExperimental} from '@utils';
import {
  ApplicationContext,
  Divider,
  HeaderRightAction,
  InputSearch,
  NavigationButton,
  Screen,
  ScreenContainerProps,
  SizedBox,
  Spacing,
  Styles,
} from '@passionui/components';
import {CategoryItem, Empty} from '@components';
import {CategoryModel, CategoryViewType} from '@models+types';
import Assets from '@assets';
import {categoryActions} from '@redux';
import {ProductList} from '@screens';
import styles from './styles';

const Category: React.FC<ScreenContainerProps> = ({navigation, ...params}) => {
  const {navigator, theme, translate} = useContext(ApplicationContext);
  const [modeView, setModeView] = useState<CategoryViewType>(
    CategoryViewType.full,
  );
  const keyword = useRef('');
  const [refreshing, setRefreshing] = useState(false);
  const [list, setList] = useState<any>(null);

  useEffect(() => {
    categoryActions.onLoad(params.item, keyword.current, setList);
  }, [params.item]);

  /**
   * on refresh category list
   */
  const onRefresh = () => {
    setRefreshing(true);
    categoryActions.onLoad(params.item, keyword.current, data => {
      setList(data);
      setRefreshing(false);
    });
  };

  /**
   * handle searching
   * @param value
   */
  const onChangeText = (value: string) => {
    keyword.current = value;
    categoryActions.onLoad(params.item, keyword.current, data => {
      setList(data);
    });
  };

  /**
   * onPress category
   * @param item
   */
  const onCategory = (item: CategoryModel) => {
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
   * render item list
   * @param item
   */
  const renderItem = ({item}: {item: CategoryModel}) => {
    return <CategoryItem item={item} onPress={onCategory} type={modeView} />;
  };

  /**
   * separator component
   */
  const separatorComponent = () => {
    return (
      <View style={Styles.paddingVerticalS}>
        <Divider />
      </View>
    );
  };

  const headerRight = useCallback(
    (props: any) => {
      const iconView = (): string => {
        switch (modeView) {
          case CategoryViewType.full:
            return 'view-agenda-outline';
          case 'icon-circle-list':
            return 'view-headline';
          default:
            return 'help';
        }
      };
      return (
        <HeaderRightAction {...props}>
          <NavigationButton
            icon={iconView()}
            onPress={() => {
              enableExperimental();
              setModeView(
                modeView === CategoryViewType.full
                  ? CategoryViewType.iconCircleList
                  : CategoryViewType.full,
              );
            }}
          />
        </HeaderRightAction>
      );
    },
    [modeView],
  );

  return (
    <Screen
      navigation={navigation}
      edges={['bottom']}
      options={{
        title: params.item?.title ?? translate('category'),
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
        data={list ?? Array.from(Array(15).keys())}
        renderItem={renderItem}
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
            title={translate('not_found_matching')}
            message={translate('please_check_keyword_again')}
            action={{title: translate('try_again'), onPress: onRefresh}}
          />
        }
        ItemSeparatorComponent={separatorComponent}
        keyExtractor={(item, index) => `category${item?.id}${index}`}
        style={Styles.flex}
        contentContainerStyle={styles.container}
      />
      <SizedBox height={Spacing.M} />
    </Screen>
  );
};

export {Category};
