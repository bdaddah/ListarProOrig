import React, {useContext} from 'react';
import {View} from 'react-native';
import {ListingWidgetModel, ProductModel, WidgetDirection} from '@models+types';
import {
  ApplicationContext,
  ContainerList,
  SizedBox,
  Spacing,
  Styles,
  Text,
} from '@passionui/components';
import {ProductItem, ProductViewType} from '@components';
import {ProductDetail} from '@screens';

const ListingWidget: React.FC<ListingWidgetModel> = widget => {
  const {theme, navigator} = useContext(ApplicationContext);

  /**
   * on press product
   */
  const onProduct = (item: ProductModel) => {
    navigator?.push({screen: ProductDetail, item});
  };

  /**
   * build direction
   */
  const buildDirection = () => {
    const horizontal = widget.direction === WidgetDirection.horizontal;
    const grid = widget.layout === ProductViewType.grid;

    const getWidthSpan = (): number => {
      if (horizontal) {
        const mapWidth: {
          [key in ProductViewType]?: number;
        } = {
          [ProductViewType.small]: 8,
          [ProductViewType.grid]: 7,
          [ProductViewType.list]: 10,
          [ProductViewType.block]: 10,
          [ProductViewType.card]: 10,
        };
        return mapWidth[widget.layout] ?? 12;
      }

      if (grid) {
        return 6;
      }

      return 12;
    };

    return (
      <ContainerList
        margin={Spacing.M}
        widthSpan={getWidthSpan()}
        horizontal={horizontal}
        scrollEnabled={horizontal}
        showsHorizontalScrollIndicator={false}
        data={widget.items}
        renderItem={({item}) => (
          <ProductItem
            item={item}
            type={widget.layout}
            onPress={() => onProduct(item)}
          />
        )}
        keyExtractor={(item, index) => `category${item?.id ?? index}`}
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

export {ListingWidget};
