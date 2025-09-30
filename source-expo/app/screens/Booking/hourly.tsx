import React, {useContext, useRef} from 'react';

import {
  ApplicationContext,
  InputDropDown,
  Radius,
  Shadow,
  SheetPicker,
  SizedBox,
  Spacing,
  Stepper,
  Styles,
  Text,
} from '@passionui/components';
import {BookingHourlyStyleModel, ScheduleModel} from '@models+types';
import {Platform, View} from 'react-native';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import moment from 'moment';

type HourlyStyleProps = {
  bookingStyle: BookingHourlyStyleModel;
  onUpdate: () => void;
};

const Hourly: React.FC<HourlyStyleProps> = ({bookingStyle, onUpdate}) => {
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

  /**
   * On select date
   */
  const onSelectDate = (value?: number, callback?: (data: number) => void) => {
    let picked: Date | undefined;
    if (Platform.OS === 'ios') {
      navigator?.showBottomSheet({
        title: translate('choose_date'),
        screen: () => (
          <DateTimePicker
            mode={'date'}
            value={new Date(value ?? Date.now())}
            display="inline"
            onChange={(event, date) => {
              if (event.type === 'set' && date) {
                picked = date;
              }
            }}
            accentColor={theme.colors.primary.default}
          />
        ),
        onDismiss: () => {
          if (picked) {
            callback?.(picked.getTime());
          }
        },
      });
    } else {
      DateTimePickerAndroid.open({
        value: new Date(value ?? Date.now()),
        onChange: (event, date) => {
          if (event.type === 'set' && date) {
            picked = date;
            callback?.(picked.getTime());
          }
        },
        mode: 'date',
        is24Hour: true,
      });
    }
  };

  /**
   * on select time
   */
  const onSelectTime = () => {
    navigator?.showBottomSheet({
      title: translate('time'),
      screen: () => {
        return (
          <SheetPicker
            data={bookingStyle?.scheduleOptions?.map((item: ScheduleModel) => {
              return {title: translate(item.title), value: item.title};
            })}
            selected={{
              title: translate(bookingStyle.schedule?.title),
              value: bookingStyle.schedule?.title,
            }}
            onSelect={index => {
              bookingStyle.schedule = bookingStyle?.scheduleOptions[index];
              navigator?.pop();
              onUpdate();
            }}
            renderItem={undefined}
          />
        );
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
        <SizedBox height={Spacing.M} />
        <InputDropDown
          floatingValue={translate('date')}
          value={moment(bookingStyle?.startDate)?.format('YYYY-MM-DD')}
          leading={'calendar-outline'}
          placeholder={translate('choose_date')}
          onPress={() =>
            onSelectDate(bookingStyle?.startDate, data => {
              bookingStyle.startDate = data;
              onUpdate();
            })
          }
        />
        <SizedBox height={Spacing.M} />
        <InputDropDown
          floatingValue={translate('hour')}
          value={bookingStyle?.schedule?.title}
          leading={'clock-outline'}
          placeholder={translate('choose_hours')}
          onPress={onSelectTime}
        />
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

export {Hourly};
