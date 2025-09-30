import React, {useContext, useEffect, useRef, useState} from 'react';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import {
  ApplicationContext,
  Badge,
  Button,
  Colors,
  Container,
  Icon,
  Input,
  InputDropDown,
  InputRef,
  InputTextArea,
  Item,
  Radius,
  Screen,
  ScreenContainerProps,
  Shadow,
  SheetPicker,
  SizedBox,
  Spacing,
  Styles,
  Text,
} from '@passionui/components';
import {useSelector} from 'react-redux';
import {categoryActions, listingActions, settingSelect} from '@redux';
import {
  CategoryModel,
  GPSModel,
  ImageModel,
  ProductModel,
  SubmitSettingModel,
} from '@models+types';
import {ImageUpload, ListTitle, PopupPickerColor} from '@components';
import {ActivityIndicator, Platform, View} from 'react-native';
import {
  GalleryUpload,
  Location,
  OpenTime,
  Picker,
  PickerTags,
  Social,
  SubmitResult,
} from '@screens';
import {convertIcon, getCurrentLocation, validate} from '@utils';
import Assets from '@assets';
import styles from './styles';
import moment from 'moment';

const SubmitListing: React.FC<ScreenContainerProps> = ({navigation, item}) => {
  const {translate, navigator, theme} = useContext(ApplicationContext);
  const setting = useSelector(settingSelect);
  const titleRef = useRef<InputRef>();
  const contentRef = useRef<InputRef>();
  const addressRef = useRef<InputRef>();
  const zipcodeRef = useRef<InputRef>();
  const phoneRef = useRef<InputRef>();
  const faxRef = useRef<InputRef>();
  const emailRef = useRef<InputRef>();
  const websiteRef = useRef<InputRef>();

  const [featureImage, setFeatureImage] = useState<ImageModel>();
  const [galleryImages, setGalleryImages] = useState<ImageModel[]>();
  const title = useRef<string>();
  const content = useRef<string>();
  const [categories, setCategories] = useState<CategoryModel[]>();
  const [facilities, setFacilities] = useState<CategoryModel[]>();
  const [tags, setTags] = useState<string[]>();
  const [country, setCountry] = useState<CategoryModel>();
  const [state, setState] = useState<CategoryModel>();
  const [stateList, setStateList] = useState<CategoryModel[]>();
  const [city, setCity] = useState<CategoryModel>();
  const [cityList, setCityList] = useState<CategoryModel[]>();
  const [gps, setGPS] = useState<GPSModel>();
  const address = useRef<string>();
  const zipcode = useRef<string>();
  const phone = useRef<string>();
  const fax = useRef<string>();
  const email = useRef<string>();
  const website = useRef<string>();
  const [color, setColor] = useState<string>(theme.colors.primary.default);
  const [icon, setIcon] = useState<string>();
  const status = useRef<string>();
  const [dateEstablish, setDateEstablish] = useState<number>(Date.now());
  const [bookingStyle, setBookingStyle] = useState<string>();
  const price = useRef<string>();
  const priceMin = useRef<string>();
  const priceMax = useRef<string>();
  const [openTime, setOpenTime] = useState();
  const [social, setSocial] = useState();
  const settingForm = useRef<SubmitSettingModel>();
  const [error, setError] = useState<any>();

  useEffect(() => {
    navigator?.showLoading();
    listingActions.initSubmit(
      item,
      (data: {
        setting: SubmitSettingModel;
        product: ProductModel | undefined;
      }) => {
        settingForm.current = data.setting;
        if (data.product) {
          setFeatureImage(data.product.image);
          setGalleryImages(data.product.galleries);
          title.current = data.product.title;
          content.current = data.product.description;
          setCategories(data.product.category ? [data.product.category] : []);
          setFacilities(data.product.features);
          setTags(data.product.tags.map(i => i.title));
          setCountry(data.product.country);
          setState(data.product.state);
          setCity(data.product.city);
          setGPS(data.product.gps);
          address.current = data.product.address;
          zipcode.current = data.product.zipCode;
          phone.current = data.product.phone;
          fax.current = data.product.fax;
          email.current = data.product.email;
          website.current = data.product.website;
          status.current = data.product.status;
          setColor(data.product.color);
          setIcon(data.product.icon);
          setDateEstablish(data.product.dateEstablish ?? Date.now());
        }
        navigator?.hideLoading();
      },
    );
  }, [item, navigator]);

  /**
   * fetch state list
   */
  useEffect(() => {
    if (country?.id) {
      setState(undefined);
      setStateList(undefined);
      setCity(undefined);
      setCityList(undefined);
      categoryActions.onLoadLocation(country, data => {
        setStateList(data);
      });
    }
  }, [country]);

  /**
   * fetch city list
   */
  useEffect(() => {
    if (state?.id) {
      setCity(undefined);
      setCityList(undefined);
      categoryActions.onLoadLocation(state, data => {
        setCityList(data);
      });
    }
  }, [state]);

  /**
   * on validate form
   */
  const onValidateForm = () => {
    const issue = Object.values(error).some(i => i !== undefined);
    if (issue) {
      return false;
    }
    if (!featureImage) {
      navigator?.showToast({message: translate('feature_image_require')});
      return false;
    }
    if (categories?.length === 0) {
      navigator?.showToast({message: translate('category_require')});
      return false;
    }
    if (facilities?.length === 0) {
      navigator?.showToast({message: translate('facilities_require')});
      return false;
    }
    if (!country) {
      navigator?.showToast({message: translate('country_require')});
      return false;
    }

    return true;
  };

  /**
   * on submit form
   */
  const onSubmit = () => {
    const valid = onValidateForm();
    if (valid) {
      listingActions.onSubmit(
        {
          id: item?.id,
          featureImage,
          galleryImages,
          title: title.current,
          content: content.current,
          categories,
          facilities,
          tags,
          country,
          state,
          city,
          gps,
          address: address.current,
          zipcode: zipcode.current,
          phone: phone.current,
          fax: fax.current,
          email: email.current,
          website: website.current,
          color,
          icon,
          status: status.current,
          dateEstablish,
          price: price.current,
          priceMin: priceMin.current,
          priceMax: priceMax.current,
          openTime,
          social,
          bookingStyle,
        },
        () => {
          navigator?.replace({screen: SubmitResult});
        },
      );
    }
  };

  /**
   * on upload gallery
   */
  const onGallery = () => {
    navigator?.push({
      screen: GalleryUpload,
      items: galleryImages,
      onChange: setGalleryImages,
    });
  };

  /**
   * on select category
   */
  const onSelectCategory = () => {
    navigator?.push({
      options: {
        title: translate('choose_category'),
      },
      screen: Picker,
      data: settingForm.current?.categories,
      selected: categories,
      multiple: true,
      onChange: (data: CategoryModel[]) => setCategories([...data]),
    });
  };

  /**
   * on select facility
   */
  const onSelectFacility = () => {
    navigator?.push({
      options: {
        title: translate('choose_facilities'),
      },
      screen: Picker,
      data: settingForm.current?.features,
      selected: categories,
      multiple: true,
      onChange: (data: CategoryModel[]) => setFacilities([...data]),
    });
  };

  /**
   * on select tag
   */
  const onSelectTag = () => {
    navigator?.push({
      screen: PickerTags,
      data: tags,
      onChange: (data: string[]) => {
        setTags(data);
      },
    });
  };

  /**
   * on select country
   */
  const onSelectCountry = () => {
    if (settingForm.current && settingForm.current?.countries?.length > 0) {
      navigator?.showBottomSheet({
        title: translate('country'),
        screen: () => {
          return (
            <SheetPicker
              data={settingForm.current!.countries.map(i => {
                return {
                  ...i,
                  title: translate(i.title),
                  value: i.id,
                  icon: undefined,
                };
              })}
              selected={{
                title: country?.title!,
                value: country?.id,
              }}
              onSelect={index => {
                setCountry(settingForm.current!.countries[index]);
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
    if (stateList && stateList?.length > 0) {
      navigator?.showBottomSheet({
        title: translate('state'),
        screen: () => {
          return (
            <SheetPicker
              data={stateList.map(i => {
                return {
                  ...i,
                  title: translate(i.title),
                  value: i.id,
                  icon: undefined,
                };
              })}
              selected={{
                title: state?.title!,
                value: state?.id,
              }}
              onSelect={index => {
                setState(stateList[index]);
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
   * on select city
   */
  const onSelectCity = () => {
    if (cityList && cityList?.length > 0) {
      navigator?.showBottomSheet({
        title: translate('city'),
        screen: () => {
          return (
            <SheetPicker
              data={cityList.map(i => {
                return {
                  ...i,
                  title: translate(i.title),
                  value: i.id,
                  icon: undefined,
                };
              })}
              selected={{
                title: city?.title!,
                value: city?.id,
              }}
              onSelect={index => {
                setCity(cityList[index]);
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
   * On location
   */
  const onLocation = async () => {
    const current = await getCurrentLocation();
    const location =
      gps ??
      new GPSModel({
        editable: true,
        latitude: current?.latitude,
        longitude: current?.longitude,
      });
    navigator?.push({
      screen: Location,
      item: location,
      onChange: (data: GPSModel) => {
        setGPS(data);
        addressRef.current?.focus?.();
      },
    });
  };

  /**
   * on select color
   */
  const onSelectColor = () => {
    navigator?.showModal({
      screen: () => <PopupPickerColor color={color} onResult={setColor} />,
    });
  };

  /**
   * on select icon
   */
  const onSelectIcon = () => {
    navigator?.showBottomSheet({
      title: translate('icon'),
      screen: () => {
        return (
          <SheetPicker
            data={Assets.json.resource?.icon.map((ic: string) => {
              return {
                title: ic,
                value: ic,
                icon: <Icon name={convertIcon(ic)} type={'FontAwesome5'} />,
              };
            })}
            selected={{title: icon!, value: icon}}
            onSelect={index => {
              setIcon(Assets.json.resource?.icon[index]);
              navigator?.pop();
            }}
            renderItem={undefined}
          />
        );
      },
    });
  };

  /**
   * on select date
   */
  const onSelectDate = () => {
    let picked: Date | undefined;
    if (Platform.OS === 'ios') {
      navigator?.showBottomSheet({
        title: translate('date_established'),
        screen: () => (
          <DateTimePicker
            mode={'date'}
            value={new Date(dateEstablish)}
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
            setDateEstablish(picked.getTime());
          }
        },
      });
    } else {
      DateTimePickerAndroid.open({
        value: new Date(dateEstablish),
        onChange: (event, date) => {
          if (event.type === 'set' && date) {
            picked = date;
            setDateEstablish(picked.getTime());
          }
        },
        mode: 'date',
        is24Hour: true,
      });
    }
  };

  /**
   * on select booking style
   */
  const onSelectBookingStyle = () => {
    const data = [
      {title: translate('daily'), value: 'daily'},
      {title: translate('hourly'), value: 'hourly'},
      {title: translate('slot'), value: 'slot'},
      {title: translate('standard'), value: 'standard'},
      {title: translate('table'), value: 'table'},
    ];
    navigator?.showBottomSheet({
      title: translate('choose_booking_style'),
      screen: () => {
        return (
          <SheetPicker
            data={data}
            selected={{title: bookingStyle!, value: bookingStyle}}
            onSelect={index => {
              setBookingStyle(data[index].value);
              navigator?.pop();
            }}
            renderItem={undefined}
          />
        );
      },
    });
  };

  /**
   * on select open time
   */
  const onSelectOpenTime = () => {
    navigator?.push({
      screen: OpenTime,
      item: openTime,
      onChange: setOpenTime,
    });
  };

  /**
   * on select social
   */
  const onSelectSocial = () => {
    navigator?.push({
      screen: Social,
      item: social,
      onChange: setSocial,
    });
  };

  /**
   * build gallery
   */
  const buildGallery = () => {
    if (galleryImages && galleryImages?.length > 0) {
      return (
        <View style={Styles.row}>
          <View style={Styles.columnCenter}>
            <ImageUpload
              progress={'line'}
              image={galleryImages[0].thumb}
              style={styles.galleryImage}
              type={'photo'}
              onPress={onGallery}
            />
            <View style={styles.badge}>
              <Badge
                label={galleryImages?.length.toString()}
                style={{backgroundColor: theme.colors.primary.default}}
              />
            </View>
            <View
              pointerEvents={'none'}
              style={[
                styles.uploadIcon,
                {backgroundColor: theme.colors.primary.default},
              ]}>
              <Icon name="image-edit-outline" color={Colors.white} />
            </View>
          </View>
        </View>
      );
    }

    return (
      <ImageUpload
        progress={'line'}
        style={styles.galleryImage}
        type={'photo'}
        onPress={onGallery}
      />
    );
  };

  return (
    <Screen
      navigation={navigation}
      scrollable={true}
      options={{
        title: item ? translate('edit_listing') : translate('add_new_listing'),
      }}
      footerComponent={
        <Button title={translate('submit')} onPress={onSubmit} />
      }
      enableKeyboardAvoidingView={true}
      scrollViewProps={{
        contentContainerStyle: Styles.paddingVerticalM,
      }}>
      <Container>
        <Item
          widthSpan={12}
          style={[
            Shadow.light,
            {
              backgroundColor: theme.colors.background.surface,
              padding: Spacing.M,
              borderRadius: Radius.M,
            },
          ]}>
          <ImageUpload
            progress={'line'}
            image={featureImage?.full}
            style={styles.featureImage}
            type={'photo'}
            onResult={setFeatureImage}
          />
          <SizedBox height={Spacing.M} />
          {buildGallery()}
        </Item>
        <Item
          widthSpan={12}
          style={[
            Shadow.light,
            {
              backgroundColor: theme.colors.background.surface,
              padding: Spacing.M,
              borderRadius: Radius.M,
            },
          ]}>
          <Input
            ref={titleRef}
            defaultValue={title.current}
            floatingValue={translate('title')}
            placeholder={translate('input_title')}
            onChangeText={value => {
              const valid = validate(value, {empty: false});
              title.current = value;
              setError({...error, title: valid});
            }}
            onFocus={() => {
              setError({...error, title: undefined});
            }}
            onBlur={() => {
              const valid = validate(title.current, {empty: false});
              setError({...error, title: valid});
            }}
            onSubmitEditing={() => contentRef.current?.focus()}
            error={translate(error?.title)}
          />
          <SizedBox height={Spacing.M} />
          <InputTextArea
            ref={contentRef}
            defaultValue={content.current}
            floatingValue={translate('content')}
            placeholder={translate('input_content')}
            onChangeText={value => {
              const valid = validate(value, {empty: false});
              content.current = value;
              setError({...error, content: valid});
            }}
            onFocus={() => {
              setError({...error, content: undefined});
            }}
            onBlur={() => {
              const valid = validate(content.current, {empty: false});
              setError({...error, content: valid});
            }}
            error={translate(error?.content)}
            style={styles.textarea}
          />
        </Item>
      </Container>
      <SizedBox height={Spacing.M} />
      <Container>
        <Item
          widthSpan={12}
          style={[
            Shadow.light,
            {
              backgroundColor: theme.colors.background.surface,
              padding: Spacing.M,
              borderRadius: Radius.M,
            },
          ]}>
          <InputDropDown
            value={categories?.map(i => i.title).join(', ')}
            floatingValue={translate('category')}
            placeholder={translate('choose_category')}
            onPress={onSelectCategory}
          />
          <SizedBox height={Spacing.M} />
          <InputDropDown
            value={facilities?.map(i => i.title).join(', ')}
            floatingValue={translate('facilities')}
            placeholder={translate('choose_facilities')}
            onPress={onSelectFacility}
          />
          <SizedBox height={Spacing.M} />
          <InputDropDown
            value={tags?.join(', ')}
            floatingValue={translate('tags')}
            placeholder={translate('choose_tags')}
            onPress={onSelectTag}
          />
        </Item>
        <Item
          widthSpan={12}
          style={[
            Shadow.light,
            {
              backgroundColor: theme.colors.background.surface,
              padding: Spacing.M,
              borderRadius: Radius.M,
            },
          ]}>
          <InputDropDown
            value={country?.title}
            floatingValue={translate('country')}
            placeholder={translate('choose_country')}
            onPress={onSelectCountry}
          />
          <SizedBox height={Spacing.M} />
          <View style={Styles.row}>
            <View style={Styles.flex}>
              <InputDropDown
                value={state?.title}
                floatingValue={translate('state')}
                placeholder={translate('choose_state')}
                trailing={
                  country &&
                  !stateList && (
                    <ActivityIndicator
                      size={16}
                      color={theme.colors.primary.default}
                    />
                  )
                }
                onPress={onSelectState}
              />
            </View>
            <SizedBox width={Spacing.M} />
            <View style={Styles.flex}>
              <InputDropDown
                value={city?.title}
                floatingValue={translate('city')}
                placeholder={translate('choose_city')}
                onPress={onSelectCity}
                trailing={
                  state &&
                  !cityList && (
                    <ActivityIndicator
                      size={16}
                      color={theme.colors.primary.default}
                    />
                  )
                }
              />
            </View>
          </View>
          <SizedBox height={Spacing.M} />
          <InputDropDown
            leading={'map-marker-outline'}
            value={gps?.toView()}
            floatingValue={translate('location')}
            placeholder={translate('choose_gps_location')}
            onPress={onLocation}
          />
          <SizedBox height={Spacing.M} />
          <Input
            ref={addressRef}
            leading={'home-outline'}
            defaultValue={address.current}
            floatingValue={translate('address')}
            placeholder={translate('input_address')}
            onChangeText={value => {
              const valid = validate(value, {empty: false});
              address.current = value;
              setError({...error, address: valid});
            }}
            onFocus={() => {
              setError({...error, address: undefined});
            }}
            onBlur={() => {
              const valid = validate(address.current, {empty: false});
              setError({...error, address: valid});
            }}
            onSubmitEditing={() => zipcodeRef.current?.focus()}
            error={translate(error?.address)}
          />
          <SizedBox height={Spacing.M} />
          <Input
            ref={zipcodeRef}
            leading={'bag-personal-outline'}
            defaultValue={zipcode.current}
            floatingValue={translate('zipcode')}
            placeholder={translate('input_zipcode')}
            keyboardType={'number-pad'}
            onChangeText={value => {
              const valid = validate(value, {empty: false, number: true});
              zipcode.current = value;
              setError({...error, zipcode: valid});
            }}
            onFocus={() => {
              setError({...error, zipcode: undefined});
            }}
            onBlur={() => {
              const valid = validate(zipcode.current, {
                empty: false,
                number: true,
              });
              setError({...error, zipcode: valid});
            }}
            error={translate(error?.zipcode)}
          />
        </Item>
      </Container>
      <SizedBox height={Spacing.M} />
      <Container>
        <Item
          widthSpan={12}
          style={[
            Shadow.light,
            {
              backgroundColor: theme.colors.background.surface,
              padding: Spacing.M,
              borderRadius: Radius.M,
            },
          ]}>
          <Input
            ref={phoneRef}
            leading={'phone-outline'}
            defaultValue={phone.current}
            floatingValue={translate('phone')}
            placeholder={translate('input_phone')}
            keyboardType={'number-pad'}
            onChangeText={value => {
              const valid = validate(value, {empty: false, phone: true});
              phone.current = value;
              setError({...error, phone: valid});
            }}
            onFocus={() => {
              setError({...error, phone: undefined});
            }}
            onBlur={() => {
              const valid = validate(phone.current, {
                empty: false,
                phone: true,
              });
              setError({...error, phone: valid});
            }}
            error={translate(error?.phone)}
          />
          <SizedBox height={Spacing.M} />
          <Input
            ref={faxRef}
            leading={'phone-outline'}
            defaultValue={fax.current}
            floatingValue={translate('fax')}
            placeholder={translate('input_fax')}
            keyboardType={'number-pad'}
            onChangeText={value => {
              const valid = validate(value, {empty: false, phone: true});
              fax.current = value;
              setError({...error, fax: valid});
            }}
            onBlur={() => {
              const valid = validate(fax.current, {empty: false, phone: true});
              setError({...error, fax: valid});
            }}
            onFocus={() => {
              setError({...error, fax: undefined});
            }}
            error={translate(error?.fax)}
          />
          <SizedBox height={Spacing.M} />
          <Input
            ref={emailRef}
            leading={'email-outline'}
            defaultValue={email.current}
            floatingValue={translate('email')}
            placeholder={translate('input_email')}
            onChangeText={value => {
              const valid = validate(value, {empty: false, email: true});
              email.current = value;
              setError({...error, email: valid});
            }}
            onBlur={() => {
              const valid = validate(email.current, {
                empty: false,
                email: true,
              });
              setError({...error, email: valid});
            }}
            onFocus={() => {
              setError({...error, email: undefined});
            }}
            onSubmitEditing={() => websiteRef.current?.focus()}
            error={translate(error?.email)}
          />
          <SizedBox height={Spacing.M} />
          <Input
            ref={websiteRef}
            leading={'web'}
            defaultValue={website.current}
            floatingValue={translate('website')}
            placeholder={translate('input_website')}
            onChangeText={value => {
              const valid = validate(value, {empty: false, website: true});
              website.current = value;
              setError({...error, website: valid});
            }}
            onBlur={() => {
              const valid = validate(website.current, {
                empty: false,
                website: true,
              });
              setError({...error, website: valid});
            }}
            onFocus={() => {
              setError({...error, website: undefined});
            }}
            error={translate(error?.website)}
          />
          <SizedBox height={Spacing.M} />
          <View style={Styles.row}>
            <View style={Styles.flex}>
              <InputDropDown
                value={color}
                leading={
                  <View style={[styles.iconColor, {backgroundColor: color}]} />
                }
                floatingValue={translate('color')}
                placeholder={translate('choose_color')}
                onPress={onSelectColor}
              />
            </View>
            <SizedBox width={Spacing.M} />
            <View style={Styles.flex}>
              <InputDropDown
                value={icon}
                floatingValue={translate('icon')}
                placeholder={translate('choose_icon')}
                onPress={onSelectIcon}
              />
            </View>
          </View>
          <SizedBox height={Spacing.M} />
          <Input
            leading={'at'}
            defaultValue={status.current}
            floatingValue={translate('status')}
            placeholder={translate('input_status')}
            onChangeText={value => {
              const valid = validate(value, {empty: false});
              status.current = value;
              setError({...error, status: valid});
            }}
            onBlur={() => {
              const valid = validate(status.current, {empty: false});
              setError({...error, status: valid});
            }}
            onFocus={() => {
              setError({...error, status: undefined});
            }}
            error={translate(error?.status)}
          />
          <SizedBox height={Spacing.M} />
          <InputDropDown
            leading={'calendar-outline'}
            value={moment(dateEstablish)?.format('MMMM D, YYYY')}
            floatingValue={translate('date_established')}
            placeholder={translate('choose_date')}
            onPress={onSelectDate}
          />
        </Item>
        <Item widthSpan={12}>
          <View
            style={[
              Shadow.light,
              {
                backgroundColor: theme.colors.background.surface,
                padding: Spacing.M,
                borderRadius: Radius.M,
              },
            ]}>
            <InputDropDown
              value={translate(bookingStyle ?? '')}
              floatingValue={translate('booking_style')}
              placeholder={translate('choose_booking_style')}
              error={translate(error?.priceMax)}
              onPress={onSelectBookingStyle}
            />
            <SizedBox height={Spacing.M} />
            <View style={Styles.row}>
              <View style={Styles.flex}>
                <Input
                  value={priceMin.current}
                  floatingValue={translate('price_min')}
                  placeholder={translate('input_price')}
                  trailing={
                    <Text typography={'caption2'}>{setting?.unit}</Text>
                  }
                  keyboardType={'number-pad'}
                  onChangeText={value => {
                    const valid = validate(value, {empty: false, number: true});
                    priceMin.current = value;
                    setError({...error, priceMin: valid});
                  }}
                  onBlur={() => {
                    const valid = validate(priceMin.current, {
                      empty: false,
                      number: true,
                    });
                    setError({...error, priceMin: valid});
                  }}
                  onFocus={() => {
                    setError({...error, priceMin: undefined});
                  }}
                  error={translate(error?.priceMin)}
                />
              </View>
              <SizedBox width={Spacing.M} />
              <View style={Styles.flex}>
                <Input
                  value={priceMax.current}
                  floatingValue={translate('price_max')}
                  placeholder={translate('input_price')}
                  trailing={
                    <Text typography={'caption2'}>{setting?.unit}</Text>
                  }
                  keyboardType={'number-pad'}
                  onChangeText={value => {
                    const valid = validate(value, {empty: false, number: true});
                    priceMax.current = value;
                    setError({...error, priceMax: valid});
                  }}
                  onBlur={() => {
                    const valid = validate(priceMax.current, {
                      empty: false,
                      number: true,
                    });
                    setError({...error, priceMax: valid});
                  }}
                  onFocus={() => {
                    setError({...error, priceMax: undefined});
                  }}
                  error={translate(error?.priceMax)}
                />
              </View>
            </View>
            <SizedBox height={Spacing.M} />
            <Input
              value={price.current}
              floatingValue={translate('price')}
              placeholder={translate('input_price')}
              trailing={<Text typography={'caption2'}>{setting?.unit}</Text>}
              keyboardType={'number-pad'}
              onChangeText={value => {
                const valid = validate(value, {empty: false, number: true});
                price.current = value;
                setError({...error, price: valid});
              }}
              onFocus={() => {
                setError({...error, price: undefined});
              }}
              onBlur={() => {
                const valid = validate(price.current, {
                  empty: false,
                  number: true,
                });
                setError({...error, price: valid});
              }}
              error={translate(error?.price)}
            />
          </View>
          <SizedBox height={Spacing.M} />
          <View
            style={[
              Shadow.light,
              {
                backgroundColor: theme.colors.background.surface,
                paddingHorizontal: Spacing.M,
                paddingVertical: Spacing.S,
                borderRadius: Radius.M,
              },
            ]}>
            <ListTitle
              title={translate('open_time')}
              onPress={onSelectOpenTime}
              description={
                <Text
                  typography={'subhead'}
                  fontWeight={'bold'}
                  color={theme.colors.primary.default}>
                  {translate('add')}
                </Text>
              }
              descriptionPosition={'right'}
            />
            <SizedBox height={Spacing.S} />
            <ListTitle
              title={translate('social_network')}
              onPress={onSelectSocial}
              description={
                <Text
                  typography={'subhead'}
                  fontWeight={'bold'}
                  color={theme.colors.primary.default}>
                  {translate('add')}
                </Text>
              }
              descriptionPosition={'right'}
            />
          </View>
        </Item>
      </Container>
    </Screen>
  );
};

export {SubmitListing};
