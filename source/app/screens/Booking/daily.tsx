import React, {useContext, useRef, useState} from 'react';

import {
  ApplicationContext,
  CheckBox,
  InputDropDown,
  Radius,
  Shadow,
  SizedBox,
  Spacing,
  Stepper,
  Styles,
  Text,
} from '@passionui/components';
import {BookingDailyStyleModel} from '@models+types';
import {Platform, View} from 'react-native';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import moment from 'moment';

type DailyStyleProps = {
  bookingStyle: BookingDailyStyleModel;
  onUpdate: () => void;
};

const Daily: React.FC<DailyStyleProps> = ({bookingStyle, onUpdate}) => {
  const {navigator, theme, translate} = useContext(ApplicationContext);

  const [useEndTime, setUseEndTime] = useState(false);
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
  const onSelectTime = (value?: number, callback?: (value: number) => void) => {
    let picked: Date | undefined;
    if (Platform.OS === 'ios') {
      navigator?.showBottomSheet({
        title: translate('time'),
        snapPoint: 'content',
        screen: () => (
          <DateTimePicker
            mode={'time'}
            value={new Date(value ?? Date.now())}
            display="spinner"
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
        mode: 'time',
        is24Hour: true,
      });
    }
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
          floatingValue={translate('start_date')}
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
          floatingValue={translate('start_hour')}
          value={moment(bookingStyle?.startTime)?.format('hh:mm')}
          leading={'clock-outline'}
          placeholder={translate('choose_hours')}
          onPress={() => {
            onSelectTime(bookingStyle?.startTime, data => {
              bookingStyle.startTime = data;
              onUpdate();
            });
          }}
        />
        <SizedBox height={Spacing.L} />
        <CheckBox
          label={translate('end_time')}
          value={useEndTime}
          onChange={value => {
            setUseEndTime(value);
            if (!value) {
              bookingStyle.endTime = undefined;
              bookingStyle.endDate = undefined;
            }
          }}
        />
        {useEndTime && (
          <>
            <SizedBox height={Spacing.M} />
            <InputDropDown
              floatingValue={translate('end_date')}
              value={moment(bookingStyle?.endDate)?.format('YYYY-MM-DD')}
              leading={'calendar-outline'}
              placeholder={translate('choose_date')}
              onPress={() =>
                onSelectDate(bookingStyle?.endDate, data => {
                  bookingStyle.endDate = data;
                  onUpdate();
                })
              }
            />
            <SizedBox height={Spacing.M} />
            <InputDropDown
              floatingValue={translate('end_hour')}
              value={moment(bookingStyle?.endTime)?.format('hh:mm')}
              leading={'clock-outline'}
              placeholder={translate('choose_hours')}
              onPress={() =>
                onSelectTime(bookingStyle?.endTime, data => {
                  bookingStyle.endTime = data;
                  onUpdate();
                })
              }
            />
          </>
        )}
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

export {Daily};
