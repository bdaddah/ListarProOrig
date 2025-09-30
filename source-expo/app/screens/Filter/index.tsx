import React, {useContext, useRef, useState} from 'react';
import {
  ApplicationContext,
  Button,
  Colors,
  HeaderRightAction,
  Icon,
  NavigationButton,
  Radius,
  Screen,
  ScreenContainerProps,
  Shadow,
  SheetPicker,
  SizedBox,
  Spacing,
  Styles,
  Tag,
  Text,
} from '@passionui/components';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import moment from 'moment';
import {Slider} from '@miblanchard/react-native-slider';

import {Platform, TouchableOpacity, View} from 'react-native';
import {
  CategoryModel,
  FilterModel,
  SettingModel,
  SortModel,
} from '@models+types';
import {categoryActions, settingSelect} from '@redux';
import {useSelector} from 'react-redux';
import styles from './styles';
import {ListTitle} from '@components';

const Filter: React.FC<ScreenContainerProps> = ({navigation, ...params}) => {
  const {theme, navigator, translate} = useContext(ApplicationContext);
  const setting: SettingModel = useSelector(settingSelect);
  const [filter, setFilter] = useState<FilterModel>(params.item.clone());
  const cityData = useRef<CategoryModel[]>();
  const stateData = useRef<CategoryModel[]>();

  /**
   * on apply filter
   */
  const onApply = () => {
    params.onApply(filter);
    navigator?.pop();
  };

  /**
   * on sort listing
   */
  const onSort = () => {
    navigator?.showBottomSheet({
      title: translate('sort'),
      screen: () => {
        return (
          <SheetPicker
            data={setting?.sort?.map((item: SortModel) => {
              return {...item, title: translate(item.title)};
            })}
            selected={filter.sort}
            onSelect={index => {
              filter.sort = setting?.sort[index];
              setFilter(filter.clone());
              navigator?.pop();
            }}
            renderItem={undefined}
          />
        );
      },
    });
  };

  /**
   * on select category
   * @param item
   */
  const onCategory = (item: CategoryModel) => {
    const index = filter.categories?.findIndex(i => i.id === item.id);
    if (index !== -1) {
      filter.categories?.splice(index, 1);
    } else {
      filter.categories?.push(item);
    }
    setFilter(filter?.clone());
  };

  /**
   * on select category
   * @param item
   */
  const onFeature = (item: CategoryModel) => {
    const index = filter.features?.findIndex(i => i.id === item.id);
    if (index !== -1) {
      filter.features?.splice(index, 1);
    } else {
      filter.features?.push(item);
    }
    setFilter(filter?.clone());
  };

  /**
   * on change country
   * @param item
   */
  const onChangeCountry = (item: CategoryModel) => {
    filter.country = item;
    filter.city = undefined;
    filter.state = undefined;
    cityData.current = undefined;
    setFilter(filter.clone());
    categoryActions.onLoadLocation(item, data => {
      cityData.current = data;
    });
  };

  /**
   * on change city
   * @param item
   */
  const onChangeCity = (item: CategoryModel) => {
    filter.city = item;
    filter.state = undefined;
    stateData.current = undefined;
    setFilter(filter.clone());
    categoryActions.onLoadLocation(item, data => {
      stateData.current = data;
    });
  };

  /**
   * on change city
   * @param item
   */
  const onChangeState = (item: CategoryModel) => {
    filter.state = item;
    setFilter(filter.clone());
  };

  /**
   * on select country
   */
  const onSelectCountry = () => {
    navigator?.showBottomSheet({
      title: translate('country'),
      screen: () => {
        return (
          <SheetPicker
            data={setting?.locations.map((item: CategoryModel) => {
              return {
                ...item,
                title: translate(item.title),
                value: item.id,
                icon: undefined,
              };
            })}
            selected={{
              title: filter.country?.title!,
              value: filter.country?.id,
            }}
            onSelect={index => {
              onChangeCountry(setting?.locations[index]);
              navigator?.pop();
            }}
            renderItem={undefined}
          />
        );
      },
    });
  };

  /**
   * on select country
   */
  const onSelectCity = () => {
    if (cityData.current) {
      navigator?.showBottomSheet({
        title: translate('country'),
        screen: () => {
          return (
            <SheetPicker
              data={cityData.current!.map((item: CategoryModel) => {
                return {
                  ...item,
                  title: translate(item.title),
                  value: item.id,
                  icon: undefined,
                };
              })}
              selected={{
                title: filter.state?.title!,
                value: filter.state?.id,
              }}
              onSelect={index => {
                onChangeCity(cityData.current![index]);
                navigator?.pop();
              }}
              renderItem={undefined}
            />
          );
        },
      });
    }
  };

  /**
   * on select state
   */
  const onSelectState = () => {
    if (stateData.current) {
      navigator?.showBottomSheet({
        title: translate('state'),
        screen: () => {
          return (
            <SheetPicker
              data={stateData.current!.map((item: CategoryModel) => {
                return {
                  ...item,
                  title: translate(item.title),
                  value: item.id,
                  icon: undefined,
                };
              })}
              selected={{
                title: filter.state?.title!,
                value: filter.state?.id,
              }}
              onSelect={index => {
                onChangeState(stateData.current![index]);
                navigator?.pop();
              }}
              renderItem={undefined}
            />
          );
        },
      });
    }
  };

  /**
   * on reset filter
   */
  const headerRight = (props: any) => {
    return (
      <HeaderRightAction {...props}>
        <NavigationButton
          icon={'restore'}
          onPress={() => {
            setFilter(params.item.clone());
          }}
        />
      </HeaderRightAction>
    );
  };

  return (
    <Screen
      navigation={navigation}
      scrollable={true}
      options={{
        title: translate('filter'),
        headerRight,
      }}
      footerComponent={<Button title={translate('apply')} onPress={onApply} />}
      scrollViewProps={{contentContainerStyle: {padding: Spacing.M}}}>
      <View
        style={[
          Shadow.light,
          {
            backgroundColor: theme.colors.background.surface,
            padding: Spacing.M,
            borderRadius: Radius.M,
          },
        ]}>
        <ListTitle
          title={translate('sort')}
          description={translate(filter.sort?.title ?? '')}
          descriptionPosition={'bottom'}
          onPress={onSort}
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
        <Text typography={'subhead'} fontWeight={'bold'}>
          {translate('category')}
        </Text>
        <SizedBox height={Spacing.S} />
        <View style={styles.wrapLine}>
          {setting?.category?.map(item => {
            const exist = filter.categories?.some(i => i.id === item.id);
            return (
              <TouchableOpacity onPress={() => onCategory(item)} key={item.id}>
                <Tag
                  label={item.title}
                  size={'large'}
                  color={exist ? theme.colors.primary.default : undefined}
                />
              </TouchableOpacity>
            );
          })}
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
        <Text typography={'subhead'} fontWeight={'bold'}>
          {translate('facilities')}
        </Text>
        <SizedBox height={Spacing.S} />
        <View style={styles.wrapLine}>
          {setting?.features?.map(item => {
            const exist = filter.features?.some(i => i.id === item.id);
            return (
              <TouchableOpacity onPress={() => onFeature(item)} key={item.id}>
                <Tag
                  label={item.title}
                  size={'large'}
                  color={exist ? theme.colors.primary.default : undefined}
                />
              </TouchableOpacity>
            );
          })}
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
        <ListTitle
          title={translate('country')}
          description={
            filter.country ? (
              <View style={Styles.row}>
                <Text
                  typography={'caption1'}
                  fontWeight={'semibold'}
                  color={theme.colors.primary.default}>
                  {filter.country.title}
                </Text>
                <SizedBox width={Spacing.XXS} />
                <Icon name={'chevron-right'} />
              </View>
            ) : (
              translate('choose_country')
            )
          }
          descriptionPosition={'right'}
          onPress={onSelectCountry}
        />
        {filter.country && (
          <ListTitle
            title={translate('city')}
            descriptionPosition={'right'}
            description={
              filter.city ? (
                <View style={Styles.row}>
                  <Text
                    typography={'caption1'}
                    fontWeight={'semibold'}
                    color={theme.colors.primary.default}>
                    {filter.city.title}
                  </Text>
                  <SizedBox width={Spacing.XXS} />
                  <Icon name={'chevron-right'} />
                </View>
              ) : (
                translate('choose_city')
              )
            }
            onPress={onSelectCity}
          />
        )}
        {filter.city && (
          <ListTitle
            title={translate('state')}
            descriptionPosition={'right'}
            description={
              filter.state ? (
                <View style={Styles.row}>
                  <Text
                    typography={'caption1'}
                    fontWeight={'semibold'}
                    color={theme.colors.primary.default}>
                    {filter.state.title}
                  </Text>
                  <SizedBox width={Spacing.XXS} />
                  <Icon name={'chevron-right'} />
                </View>
              ) : (
                translate('choose_state')
              )
            }
            onPress={onSelectState}
          />
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
        <Text typography={'subhead'} fontWeight={'bold'}>
          {translate('distance')}
        </Text>
        <SizedBox height={Spacing.S} />
        <View style={Styles.rowSpace}>
          <Text typography={'caption2'}>0Km</Text>
          <Text typography={'caption2'}>30Km</Text>
        </View>
        <Slider
          minimumTrackTintColor={theme.colors.primary.default}
          thumbTintColor={theme.colors.primary.default}
          containerStyle={styles.slider}
          value={filter.distance}
          minimumValue={0}
          maximumValue={30}
          onValueChange={value => {
            filter.distance = value[0];
          }}
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
        <Text typography={'subhead'} fontWeight={'bold'}>
          {translate('price_range')}
        </Text>
        <SizedBox height={Spacing.S} />
        <View style={Styles.rowSpace}>
          <Text typography={'caption2'}>{setting?.minPrice}</Text>
          <Text typography={'caption2'}>{setting?.maxPrice}</Text>
        </View>
        <Slider
          minimumTrackTintColor={theme.colors.primary.default}
          thumbTintColor={theme.colors.primary.default}
          containerStyle={styles.slider}
          value={[
            filter.minPrice ?? setting?.minPrice,
            filter.maxPrice ?? setting?.maxPrice,
          ]}
          minimumValue={setting?.minPrice}
          maximumValue={setting?.maxPrice}
          onValueChange={value => {
            filter.minPrice = value[0];
            filter.maxPrice = value[1];
          }}
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
        <Text typography={'subhead'} fontWeight={'bold'}>
          {translate('business_color')}
        </Text>
        <SizedBox height={Spacing.S} />
        <View style={styles.colorContainer}>
          {setting?.colors?.map(item => {
            const selected = filter.color === item;
            return (
              <TouchableOpacity
                style={[styles.colorIcon, {backgroundColor: item}]}
                onPress={() => {
                  filter.color = item;
                  setFilter(filter.clone());
                }}
                key={item}>
                {selected && <Icon name={'check'} color={Colors.white} />}
              </TouchableOpacity>
            );
          })}
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
        <Text typography={'subhead'} fontWeight={'bold'}>
          {translate('open_time')}
        </Text>
        <SizedBox height={Spacing.S} />
        <View style={Styles.rowSpace}>
          <Text typography={'caption1'}>{translate('start_time')}</Text>
          {Platform.select({
            ios: (
              <DateTimePicker
                mode={'time'}
                value={moment(filter.startHour, 'HH:mm').toDate()}
                is24Hour={true}
                onChange={(event, date) => {
                  if (event.type === 'set') {
                    filter.startHour = moment(date).format('HH:mm');
                    setFilter(filter.clone());
                  }
                }}
              />
            ),
            default: (
              <TouchableOpacity
                onPress={() => {
                  DateTimePickerAndroid.open({
                    value: moment(filter.startHour, 'HH:mm').toDate(),
                    onChange: (event, date) => {
                      if (event.type === 'set') {
                        filter.startHour = moment(date).format('HH:mm');
                        setFilter(filter.clone());
                      }
                    },
                    mode: 'time',
                    is24Hour: true,
                  });
                }}>
                <Text typography={'subhead'} fontWeight={'semibold'}>
                  {filter.startHour}
                </Text>
              </TouchableOpacity>
            ),
          })}
        </View>
        <SizedBox height={Spacing.S} />
        <View style={Styles.rowSpace}>
          <Text typography={'caption1'}>{translate('end_time')}</Text>
          {Platform.select({
            ios: (
              <DateTimePicker
                mode={'time'}
                value={moment(filter.endHour, 'HH:mm').toDate()}
                is24Hour={true}
                onChange={(event, date) => {
                  if (event.type === 'set') {
                    filter.endHour = moment(date).format('HH:mm');
                    setFilter(filter.clone());
                  }
                }}
              />
            ),
            default: (
              <TouchableOpacity
                onPress={() => {
                  DateTimePickerAndroid.open({
                    value: moment(filter.endHour, 'HH:mm').toDate(),
                    onChange: (event, date) => {
                      if (event.type === 'set') {
                        filter.endHour = moment(date).format('HH:mm');
                        setFilter(filter.clone());
                      }
                    },
                    mode: 'time',
                    is24Hour: true,
                  });
                }}>
                <Text typography={'subhead'} fontWeight={'semibold'}>
                  {filter.endHour}
                </Text>
              </TouchableOpacity>
            ),
          })}
        </View>
      </View>
    </Screen>
  );
};

export {Filter};
