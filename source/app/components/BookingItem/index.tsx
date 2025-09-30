import React, {useContext} from 'react';
import {
  ApplicationContext,
  SizedBox,
  Skeleton,
  Spacing,
  Styles,
  Text,
} from '@passionui/components';
import {StyleProp, TouchableOpacity, View, ViewStyle} from 'react-native';
import {BookingModel} from '@models+types';
import moment from 'moment';

type BookingItemProps = {
  item?: BookingModel;
  onPress?: (item: BookingModel) => void;
  style?: StyleProp<ViewStyle>;
};

const BookingItem: React.FC<BookingItemProps> = ({item, onPress, style}) => {
  const {theme} = useContext(ApplicationContext);

  if (item?.id) {
    return (
      <TouchableOpacity
        onPress={() => onPress?.(item)}
        style={[Styles.row, Styles.paddingVerticalM, style]}>
        <View style={Styles.flex}>
          <Text typography={'subhead'} fontWeight={'bold'}>
            {item.title}
          </Text>
          <SizedBox height={Spacing.XS} />
          <Text typography={'caption1'} color={theme.colors.text.secondary}>
            {item.createdBy}
          </Text>
        </View>
        <View style={Styles.columnCenterRight}>
          <Text typography={'caption1'} color={theme.colors.text.secondary}>
            {moment(item.date)?.format('MMMM D, YYYY')}
          </Text>
          <SizedBox height={Spacing.XS} />
          <Text
            typography={'footnote'}
            fontWeight={'bold'}
            color={item.statusColor}>
            {item.status}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[Styles.row, Styles.paddingVerticalM, style]}>
      <View style={Styles.flex}>
        <SizedBox height={12} width={100}>
          <Skeleton />
        </SizedBox>
        <SizedBox height={Spacing.S} />
        <SizedBox height={10} width={150}>
          <Skeleton />
        </SizedBox>
      </View>
      <View style={Styles.columnCenterRight}>
        <SizedBox height={12} width={100}>
          <Skeleton />
        </SizedBox>
        <SizedBox height={Spacing.S} />
        <SizedBox height={10} width={150}>
          <Skeleton />
        </SizedBox>
      </View>
    </View>
  );
};

export {BookingItem};
