import React, {FC} from 'react';
import {FlatList, FlatListProps} from 'react-native';
import {GridContext, Item, SizedBox} from '../index';

import styles from './styles';
import {useGridSystem} from './utils';

export interface ItemListProps extends FlatListProps<any> {
  /**
   * Represents the width of the item in terms of span numbers (1-12).
   */
  widthSpan?: number;
  /**
   * Represents the height of the item in terms of span numbers (1-12).
   */
  heightSpan?: number;
  /**
   * Represents the style of the container.
   */
  margin?: number;
  /**
   * Represents the padding of the container.
   */
  padding?: number;
  /**
   * Represents the gutter of the container.
   */
  gutter?: number;
}

const ContainerList: FC<ItemListProps> = ({
  renderItem,
  widthSpan,
  heightSpan,
  margin = 0,
  padding = 0,
  gutter = 12,
  style,
  contentContainerStyle,
  horizontal,
  ...props
}) => {
  const {numberOfColumns, widthDevice} = useGridSystem();
  const widthSection = widthDevice - margin * 2;
  const totalGutterSize = gutter * (numberOfColumns - 1);
  const totalItemSize = widthSection - totalGutterSize - padding * 2;
  const sizePerSpan = totalItemSize / numberOfColumns;

  const widthItem = (widthSpan ?? numberOfColumns) as number;
  const numColumns = horizontal ? 1 : Math.floor(numberOfColumns / widthItem);

  const _renderItem = (data: any) => {
    return (
      <Item widthSpan={widthItem} heightSpan={heightSpan}>
        {renderItem?.(data)}
      </Item>
    );
  };

  return (
    <GridContext.Provider
      value={{
        numberOfColumns,
        gutter,
        sizePerSpan,
        getSizeSpan: span => {
          return span * sizePerSpan + (span - 1) * gutter;
        },
      }}>
      <FlatList
        {...props}
        key={`ItemList-${numColumns}`}
        horizontal={horizontal}
        numColumns={numColumns}
        renderItem={_renderItem}
        columnWrapperStyle={numColumns !== 1 && {gap: gutter}}
        ItemSeparatorComponent={() => (
          <SizedBox width={gutter} height={gutter} />
        )}
        style={[
          style,
          styles.protectedStyle,
          {
            width: widthSection,
            marginHorizontal: margin,
          },
        ]}
        contentContainerStyle={[
          contentContainerStyle,
          styles.protectedStyle,
          {padding},
        ]}
      />
    </GridContext.Provider>
  );
};

export default ContainerList;
