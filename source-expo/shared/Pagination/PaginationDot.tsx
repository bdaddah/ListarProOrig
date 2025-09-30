import React, {FC, useContext} from 'react';
import {View} from 'react-native';
import Dot from './Dot';
import {ApplicationContext, Spacing, ChildPaginationProps} from '../index';
import styles from './styles';

const PaginationDot: FC<ChildPaginationProps> = ({
  dataLength = 2,
  activeIndex = 0,
}) => {
  const {theme} = useContext(ApplicationContext);
  const renderDots = () => {
    const dots = [];
    for (let i = 0; i < dataLength; i++) {
      dots.push(
        <Dot
          key={`Dot${i}`}
          style={[
            i !== dataLength - 1 ? {marginRight: Spacing.XS} : {},
            {backgroundColor: theme.colors.primary.default},
          ]}
          active={activeIndex === i}
        />,
      );
    }
    return dots;
  };
  return <View style={styles.paginationPinkContainer}>{renderDots()}</View>;
};

export default PaginationDot;
