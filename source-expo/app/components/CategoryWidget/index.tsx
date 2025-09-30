import React, {useContext} from 'react';
import {FlatList, View, ViewStyle} from 'react-native';
import {
  CategoryModel,
  CategoryViewType,
  CategoryWidgetModel,
  WidgetDirection,
} from '@models+types';
import {
  ApplicationContext,
  SizedBox,
  Spacing,
  Styles,
  Text,
} from '@passionui/components';
import {CategoryItem, SpaceList} from '@components';
import {Category, ProductList} from '@screens';

const CategoryWidget: React.FC<CategoryWidgetModel> = widget => {
  const {theme, navigator, translate} = useContext(ApplicationContext);

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
   * build direction
   */
  const buildDirection = () => {
    const horizontal = widget.direction === WidgetDirection.horizontal;
    const grid = widget.direction === WidgetDirection.grid;
    let data = widget.items ?? [];

    if (grid) {
      data = [
        ...data,
        new CategoryModel({
          id: -1,
          icon: 'ellipsis-h',
          color: theme.colors.primary.default,
          hasChild: true,
          title: translate('more'),
        }),
      ];
    }
    const getStyle = (): ViewStyle => {
      if (grid) {
        return {flex: 1};
      }
      if (horizontal) {
        const mapWidth: {
          [key in CategoryViewType]?: number;
        } = {
          [CategoryViewType.iconCircle]: 70,
          [CategoryViewType.iconRound]: 90,
          [CategoryViewType.iconSquare]: 150,
          [CategoryViewType.iconLandscape]: 220,
          [CategoryViewType.iconPortrait]: 120,
          [CategoryViewType.imageCircle]: 70,
          [CategoryViewType.imageRound]: 90,
          [CategoryViewType.imageSquare]: 150,
          [CategoryViewType.imageLandscape]: 220,
          [CategoryViewType.imagePortrait]: 120,
        };
        return {width: mapWidth[widget.layout]};
      }
      return {};
    };

    const getColumn = () => {
      if (grid) {
        const mapColumn: {
          [key in CategoryViewType]?: number;
        } = {
          [CategoryViewType.iconCircle]: 4,
          [CategoryViewType.iconRound]: 3,
          [CategoryViewType.iconSquare]: 2,
          [CategoryViewType.iconLandscape]: 2,
          [CategoryViewType.iconPortrait]: 2,
          [CategoryViewType.imageCircle]: 4,
          [CategoryViewType.imageRound]: 3,
          [CategoryViewType.imageSquare]: 2,
          [CategoryViewType.imageLandscape]: 2,
          [CategoryViewType.imagePortrait]: 2,
        };
        return mapColumn[widget.layout];
      }
      return 1;
    };

    return (
      <FlatList
        style={Styles.paddingHorizontalM}
        numColumns={getColumn()}
        columnWrapperStyle={grid && {gap: Spacing.M}}
        horizontal={horizontal}
        scrollEnabled={horizontal}
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={({item}) => (
          <CategoryItem
            item={item}
            type={widget.layout}
            onPress={() => onCategory(item)}
            style={getStyle()}
          />
        )}
        keyExtractor={(item, index) => `category${item?.id ?? index}`}
        ItemSeparatorComponent={SpaceList}
      />
    );
  };

  return (
    <View>
      <View style={Styles.paddingHorizontalM}>
        {widget.title && (
          <Text typography="callout" fontWeight="bold">
            {widget.title}
          </Text>
        )}
        {widget.description && (
          <Text typography="caption1" color={theme.colors.text.secondary}>
            {widget.description}
          </Text>
        )}
        {widget.title || widget.description ? (
          <SizedBox height={Spacing.S} />
        ) : null}
      </View>
      {buildDirection()}
    </View>
  );
};

export {CategoryWidget};
