import React, {useContext, useState} from 'react';
import {
  ApplicationContext,
  Button,
  IconButton,
  InputDropDown,
  Screen,
  ScreenContainerProps,
  SizedBox,
  Spacing,
  Styles,
  Text,
} from '@passionui/components';
import {OpenTimeModel, ScheduleModel} from '@models+types';
import {Platform, View} from 'react-native';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import moment from 'moment';

const DEFAULT_OPEN_TIME = [
  new OpenTimeModel({
    key: 'mon',
    dayOfWeek: 1,
    schedule: [
      new ScheduleModel({
        view: '',
        start: '08:00',
        end: '18:00',
      }),
    ],
  }),
  new OpenTimeModel({
    key: 'tue',
    dayOfWeek: 2,
    schedule: [
      new ScheduleModel({
        view: '',
        start: '08:00',
        end: '18:00',
      }),
    ],
  }),
  new OpenTimeModel({
    key: 'wed',
    dayOfWeek: 3,
    schedule: [
      new ScheduleModel({
        view: '',
        start: '08:00',
        end: '18:00',
      }),
    ],
  }),
  new OpenTimeModel({
    key: 'thu',
    dayOfWeek: 4,
    schedule: [
      new ScheduleModel({
        view: '',
        start: '08:00',
        end: '18:00',
      }),
    ],
  }),
  new OpenTimeModel({
    key: 'fri',
    dayOfWeek: 5,
    schedule: [
      new ScheduleModel({
        view: '',
        start: '08:00',
        end: '18:00',
      }),
    ],
  }),
  new OpenTimeModel({
    key: 'sat',
    dayOfWeek: 6,
    schedule: [
      new ScheduleModel({
        view: '',
        start: '08:00',
        end: '18:00',
      }),
    ],
  }),
  new OpenTimeModel({
    key: 'sun',
    dayOfWeek: 0,
    schedule: [
      new ScheduleModel({
        view: '',
        start: '08:00',
        end: '18:00',
      }),
    ],
  }),
];

const OpenTime: React.FC<ScreenContainerProps> = ({
  navigation,
  item,
  onChange,
}) => {
  const {translate, navigator, theme} = useContext(ApplicationContext);
  const [openTime, setOpenTime] = useState(item ?? DEFAULT_OPEN_TIME);

  /**
   * on apply
   */
  const onApply = () => {
    onChange?.(openTime);
    navigator?.pop();
  };

  /**
   * on select time
   */
  const onSelectTime = (value: string, callback: (value: string) => void) => {
    let picked: Date | undefined;
    if (Platform.OS === 'ios') {
      navigator?.showBottomSheet({
        title: translate('time'),
        snapPoint: 'content',
        screen: () => (
          <DateTimePicker
            mode={'time'}
            value={moment(value, 'HH:mm').toDate()}
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
            callback(moment(picked).format('hh:mm'));
          }
        },
      });
    } else {
      DateTimePickerAndroid.open({
        value: moment(value, 'HH:mm').toDate(),
        onChange: (event, date) => {
          if (event.type === 'set' && date) {
            picked = date;
            callback(moment(picked).format('hh:mm'));
          }
        },
        mode: 'time',
        is24Hour: true,
      });
    }
  };

  return (
    <Screen
      navigation={navigation}
      scrollable={true}
      enableKeyboardAvoidingView={true}
      scrollViewProps={{
        contentContainerStyle: [
          Styles.paddingM,
          {backgroundColor: theme.colors.background.surface},
        ],
      }}
      options={{title: translate('open_time')}}
      footerComponent={<Button title={translate('apply')} onPress={onApply} />}>
      {openTime?.map((open: OpenTimeModel, index: number) => {
        return (
          <View key={open.key} style={Styles.paddingVerticalXS}>
            <Text typography="subhead" fontWeight="bold">
              {translate(open.key)}
            </Text>
            <SizedBox height={Spacing.S} />
            {open.schedule?.map((schedule: ScheduleModel, i: number) => {
              const canAdd = i === 0;
              return (
                <View
                  key={`${schedule.title}${i}`}
                  style={[Styles.row, Styles.paddingVerticalXS]}>
                  <View style={Styles.flex}>
                    <InputDropDown
                      floatingValue={translate('start_time')}
                      value={schedule.start}
                      placeholder={translate('select_hour')}
                      onPress={() =>
                        onSelectTime(schedule.start, value => {
                          schedule.start = value;
                          setOpenTime([...openTime]);
                        })
                      }
                    />
                  </View>
                  <SizedBox width={Spacing.M} />
                  <View style={Styles.flex}>
                    <InputDropDown
                      floatingValue={translate('end_time')}
                      value={schedule.end}
                      placeholder={translate('select_hour')}
                      onPress={() => {
                        onSelectTime(schedule.end, value => {
                          schedule.end = value;
                          setOpenTime([...openTime]);
                        });
                      }}
                    />
                  </View>
                  <SizedBox width={Spacing.M} />
                  <IconButton
                    type="primary"
                    size="small"
                    icon={canAdd ? 'plus' : 'minus'}
                    onPress={() => {
                      if (canAdd) {
                        open.schedule.push(
                          new ScheduleModel({
                            view: '',
                            start: '08:00',
                            end: '18:00',
                          }),
                        );
                        setOpenTime([...openTime]);
                      } else {
                        open.schedule.splice(index, 1);
                        setOpenTime([...openTime]);
                      }
                    }}
                  />
                </View>
              );
            })}
          </View>
        );
      })}
    </Screen>
  );
};

export {OpenTime};
