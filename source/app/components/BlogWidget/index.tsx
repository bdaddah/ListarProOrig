import React, {useContext} from 'react';
import {View} from 'react-native';
import {BlogModel, BlogWidgetModel, WidgetDirection} from '@models+types';
import {
  ApplicationContext,
  ContainerList,
  SizedBox,
  Spacing,
  Styles,
  Text,
} from '@passionui/components';
import {BlogDetail} from '@screens';
import {BlogItem, BlogViewType} from '@components';

const BlogWidget: React.FC<BlogWidgetModel> = widget => {
  const {theme, navigator} = useContext(ApplicationContext);

  /**
   * on press blog
   */
  const onBlog = (item: BlogModel) => {
    navigator?.push({screen: BlogDetail, item});
  };

  /**
   * build direction
   */
  const buildDirection = () => {
    const horizontal = widget.direction === WidgetDirection.horizontal;
    const grid = widget.layout === BlogViewType.grid;

    const getWidthSpan = (): number => {
      if (horizontal) {
        const mapWidth: {
          [key in BlogViewType]?: number;
        } = {
          [BlogViewType.grid]: 7,
          [BlogViewType.list]: 10,
          [BlogViewType.block]: 10,
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
          <BlogItem
            item={item}
            type={widget.layout}
            onPress={() => onBlog(item)}
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

export {BlogWidget};
