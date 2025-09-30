import React, {FC} from 'react';
import {View} from 'react-native';
import {Colors, Spacing, ChildPaginationProps} from '../index';
import styles from './styles';
import Dot from './Dot';

const PaginationWhiteDot: FC<ChildPaginationProps> = ({
  dataLength = 2,
  activeIndex = 0,
}) => {
  const renderDots = () => {
    const dots = [];
    for (let i = 0; i < dataLength; i++) {
      dots.push(
        <Dot
          style={[
            i !== dataLength - 1 ? {marginRight: Spacing.XS} : {},
            {backgroundColor: Colors.white},
          ]}
          active={activeIndex === i}
        />,
      );
    }
    return dots;
  };
  return <View style={[styles.paginationWhiteContainer]}>{renderDots()}</View>;
};

export default PaginationWhiteDot;
