import React, {ReactNode} from 'react';
import {Icon, SizedBox, Spacing, Styles, Text} from '@passionui/components';
import {StyleProp, TouchableOpacity, View, ViewStyle} from 'react-native';
import styles from './styles';

type ListTitleProps = {
  leading?: ReactNode;
  title: string;
  description?: string | ReactNode;
  descriptionPosition?: 'right' | 'bottom';
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

const ListTitle: React.FC<ListTitleProps> = ({
  leading,
  title,
  description,
  descriptionPosition = 'bottom',
  onPress,
  style,
}) => {
  /**
   * Build description
   */
  const buildDescription = () => {
    if (description) {
      return (
        <>
          <SizedBox height={Spacing.XXS} width={Spacing.XXS} />
          {typeof description === 'string' ? (
            <Text typography={'caption1'}>{description}</Text>
          ) : (
            description
          )}
        </>
      );
    }
  };

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      {!!leading && (
        <>
          {leading}
          <SizedBox width={Spacing.S} />
        </>
      )}
      <View
        style={[
          Styles.flex,
          descriptionPosition === 'right' && Styles.rowSpace,
        ]}>
        <Text typography={'subhead'} fontWeight={'bold'}>
          {title}
        </Text>
        {!!description && buildDescription()}
      </View>
      {(typeof description === 'string' || !description) && (
        <Icon name={'chevron-right'} />
      )}
    </TouchableOpacity>
  );
};

export {ListTitle};
