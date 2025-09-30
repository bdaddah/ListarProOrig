import React, {useContext} from 'react';
import {View} from 'react-native';

import {GridContext, ItemProps} from '../index';
import styles from './styles';

const Item: React.FC<ItemProps> = ({
  widthSpan,
  heightSpan,
  children,
  style,
}) => {
  const grid = useContext(GridContext);

  return (
    <View
      style={[
        style,
        styles.item,
        {
          width: grid.getSizeSpan(widthSpan ?? grid.numberOfColumns),
          height: heightSpan ? grid.getSizeSpan(heightSpan) : undefined,
        },
      ]}>
      {children}
    </View>
  );
};

export default Item;
