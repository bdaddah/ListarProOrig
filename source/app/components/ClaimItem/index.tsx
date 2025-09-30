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
import {ClaimModel} from '@models+types';

type ClaimItemProps = {
  item?: ClaimModel;
  onPress?: (item: ClaimModel) => void;
  style?: StyleProp<ViewStyle>;
};

const ClaimItem: React.FC<ClaimItemProps> = ({item, onPress, style}) => {
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
          <Text
            typography={'caption1'}
            color={theme.colors.text.secondary}
            numberOfLines={1}>
            {item.address}
          </Text>
          {item.priceDisplay && (
            <>
              <SizedBox height={Spacing.XS} />
              <Text
                typography={'headline'}
                color={theme.colors.primary.default}>
                {item.priceDisplay}
              </Text>
            </>
          )}
        </View>
        <SizedBox width={Spacing.M} />
        <View style={Styles.columnCenterRight}>
          <Text
            typography={'footnote'}
            fontWeight={'bold'}
            color={item.statusColor}>
            {item.status}
          </Text>
          <SizedBox height={Spacing.XS} />
          <Text typography={'caption1'} color={theme.colors.text.secondary}>
            {item.date?.format('MMMM D, YYYY')}
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

export {ClaimItem};
