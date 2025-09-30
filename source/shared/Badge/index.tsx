import React, {FC, useContext} from 'react';
import {View} from 'react-native';

import {ApplicationContext, BadgeProps, Colors, Text} from '../index';
import styles from './styles';

const Badge: FC<BadgeProps> = ({label = 'Label', type, style}) => {
  const {theme} = useContext(ApplicationContext);

  const renderDot = () => {
    return (
      <View
        style={[
          styles.dotContainer,
          {
            backgroundColor: theme.colors.error.default,
            borderColor: theme.colors.border.disable,
          },
        ]}
      />
    );
  };

  const renderDefault = () => {
    return (
      <View
        style={[
          styles.defaultContainer,
          {
            backgroundColor: theme.colors.error.default,
            borderColor: theme.colors.border.disable,
          },
          style,
        ]}>
        <Text typography={'caption2'} fontWeight={'bold'} color={Colors.white}>
          {label}
        </Text>
      </View>
    );
  };

  switch (type) {
    case 'dot':
      return renderDot();
    default:
      return renderDefault();
  }
};

export {Badge};
