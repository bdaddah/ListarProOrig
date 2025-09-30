import React, {useContext, useRef} from 'react';

import {
  ApplicationContext,
  InputDropDown,
  Radius,
  Shadow,
  SizedBox,
  Spacing,
  Stepper,
  Styles,
  Text,
} from '@passionui/components';
import {BookingSlotStyleModel} from '@models+types';
import {View} from 'react-native';

type SlotStyleProps = {
  bookingStyle: BookingSlotStyleModel;
  onUpdate: () => void;
};

const Slot: React.FC<SlotStyleProps> = ({bookingStyle, onUpdate}) => {
  const {navigator, theme, translate} = useContext(ApplicationContext);
  const adult = useRef(bookingStyle?.adult);
  const children = useRef(bookingStyle?.children);

  /**
   * On select adult
   */
  const onSelectAdult = () => {
    navigator?.showBottomSheet({
      title: translate('choose_adult'),
      snapPoint: 'content',
      backgroundColor: theme.colors.background.surface,
      screen: () => (
        <View style={[Styles.paddingM, Styles.columnCenter]}>
          <Stepper
            defaultValue={bookingStyle?.adult}
            onChange={value => (adult.current = value)}
          />
        </View>
      ),
      onDismiss: () => {
        bookingStyle.adult = adult.current;
        onUpdate();
      },
    });
  };

  /**
   * On select children
   */
  const onSelectChildren = () => {
    navigator?.showBottomSheet({
      title: translate('choose_children'),
      snapPoint: 'content',
      backgroundColor: theme.colors.background.surface,
      screen: () => (
        <View style={[Styles.paddingM, Styles.columnCenter]}>
          <Stepper
            defaultValue={bookingStyle?.children}
            onChange={value => (children.current = value)}
          />
        </View>
      ),
      onDismiss: () => {
        bookingStyle.children = children.current;
        onUpdate();
      },
    });
  };

  return (
    <>
      <View
        style={[
          Shadow.light,
          {
            backgroundColor: theme.colors.background.surface,
            padding: Spacing.M,
            borderRadius: Radius.M,
          },
        ]}>
        <View style={Styles.row}>
          <View style={Styles.flex}>
            <InputDropDown
              floatingValue={translate('adult')}
              value={bookingStyle?.adult?.toString()}
              placeholder={translate('choose_adult')}
              leading={'account-outline'}
              onPress={onSelectAdult}
            />
          </View>
          <SizedBox width={Spacing.M} />
          <View style={Styles.flex}>
            <InputDropDown
              floatingValue={translate('children')}
              value={bookingStyle?.children?.toString()}
              leading={'baby-face-outline'}
              placeholder={translate('choose_children')}
              onPress={onSelectChildren}
            />
          </View>
        </View>
      </View>
      <SizedBox height={Spacing.M} />
      <View
        style={[
          Shadow.light,
          {
            backgroundColor: theme.colors.background.surface,
            padding: Spacing.M,
            borderRadius: Radius.M,
          },
        ]}>
        <View style={Styles.rowSpace}>
          <Text typography="subhead" fontWeight="bold">
            {translate('total')}
          </Text>
          <Text typography="subhead" fontWeight="bold">
            {bookingStyle?.price}
          </Text>
        </View>
      </View>
    </>
  );
};

export {Slot};
