import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  ApplicationContext,
  Button,
  Icon,
  Input,
  InputRef,
  InputTextArea,
  Radius,
  Screen,
  ScreenContainerProps,
  Shadow,
  SizedBox,
  Spacing,
  Steps,
  Styles,
  Text,
} from '@passionui/components';
import {bookingActions, userSelect} from '@redux';
import {View} from 'react-native';
import {
  BookingDailyStyleModel,
  BookingHourlyStyleModel,
  BookingSlotStyleModel,
  BookingStandardStyleModel,
  BookingStyleModel,
  PaymentMethodModel,
  PaymentModel,
  UserModel,
} from '@models+types';
import {useSelector} from 'react-redux';
import {BookingManagement, Payment} from '@screens';
import {Daily} from './daily';
import {validate} from '@utils';
import styles from './styles';
import {Standard} from './standard';
import {Slot} from './slot';
import {Hourly} from './hourly';

const Booking: React.FC<ScreenContainerProps> = ({navigation, item}) => {
  const {navigator, theme, translate} = useContext(ApplicationContext);
  const user: UserModel = useSelector(userSelect);
  const firstNameRef = useRef<InputRef>();
  const lastNameRef = useRef<InputRef>();
  const phoneRef = useRef<InputRef>();
  const emailRef = useRef<InputRef>();
  const addressRef = useRef<InputRef>();
  const contentRef = useRef<InputRef>();

  const firstName = useRef(user.firstName);
  const lastName = useRef(user.lastName);
  const phone = useRef('');
  const email = useRef(user.email);
  const address = useRef('');
  const content = useRef('');
  const [error, setError] = useState<any>({});
  const [step, setStep] = useState(0);
  const [payment, setPayment] = useState<PaymentModel>();
  const [bookingStyle, setBookingStyle] = useState<BookingStyleModel>();

  let steps = [
    {title: translate('details'), icon: 'calendar'},
    {title: translate('contact'), icon: 'account-box-outline'},
    {title: translate('completed'), icon: 'check'},
  ];
  if (payment?.use) {
    steps = [
      {title: translate('details'), icon: 'calendar'},
      {title: translate('contact'), icon: 'account-box-outline'},
      {title: translate('payment'), icon: 'credit-card-outline'},
      {title: translate('completed'), icon: 'check'},
    ];
  }

  useEffect(() => {
    bookingActions.init(item, data => {
      setBookingStyle(data.style);
      setPayment(data.payment);
    });
  }, [item]);

  /**
   * on booking management
   */
  const onBookingManagement = () => {
    navigator?.replace({screen: BookingManagement});
  };

  /**
   * on payment
   */
  const onPayment = () => {
    navigator?.push({
      screen: Payment,
      onPayment: (method: PaymentMethodModel) => {
        payment!.method = method;
        return new Promise(resolve => {
          onBooking(resolve);
        });
      },
    });
  };

  /**
   * booking order
   */
  const onBooking = (callback?: (url?: string) => void) => {
    bookingActions.onOrder(
      item,
      payment?.method!,
      bookingStyle!,
      {
        firstName: firstName.current,
        lastName: lastName.current,
        phone: phone.current,
        email: email.current,
        address: address.current,
        content: content.current,
      },
      url => {
        setStep(steps.length - 1);
        callback?.(url);
      },
    );
  };

  /**
   * update style & calc price
   */
  const onUpdateBookingStyle = () => {
    const errorMessage = bookingStyle?.validate();
    setBookingStyle(bookingStyle?.clone());
    if (errorMessage) {
      navigator?.showToast({message: translate(errorMessage)});
      return;
    }
    bookingActions.onCalcPrice(item, bookingStyle!, ({price}) => {
      bookingStyle!.price = price;
      setBookingStyle(bookingStyle?.clone());
    });
  };

  /**
   * next step process
   */
  const onNextStep = () => {
    let errorMessage;
    switch (step) {
      case 0:
        errorMessage = bookingStyle?.validate();
        if (errorMessage) {
          navigator?.showToast({message: translate(errorMessage)});
          return;
        }
        setStep(step + 1);
        break;
      case 1:
        const issue = {
          firstName: validate(firstName.current, {empty: false}),
          lastName: validate(lastName.current, {empty: false}),
          phone: validate(phone.current, {empty: false, number: true}),
          email: validate(email.current, {empty: false, email: true}),
          address: validate(address.current, {empty: false}),
        };
        setError(issue);
        const valid = Object.values(issue).some(i => i !== undefined);
        if (valid) {
          return;
        }
        if (payment?.use) {
          onPayment();
        } else {
          onBooking();
        }
        break;

      default:
    }
  };

  /**
   * build action button
   */
  const buildAction = () => {
    switch (step) {
      case 0:
        return <Button onPress={onNextStep} title={translate('next')} />;
      case 1:
        return (
          <View style={Styles.row}>
            <View style={Styles.flex}>
              <Button
                onPress={() => setStep(step - 1)}
                title={translate('previous')}
                type={'outline'}
              />
            </View>
            <SizedBox width={Spacing.M} />
            <View style={Styles.flex}>
              <Button onPress={onNextStep} title={translate('next')} />
            </View>
          </View>
        );
      case 3:
        return (
          <Button
            onPress={onBookingManagement}
            title={translate('booking_management')}
          />
        );

      default:
        return <View />;
    }
  };

  /**
   * render info
   */
  const buildInfo = () => {
    switch (bookingStyle?.style) {
      case 'daily':
        return (
          <Daily
            bookingStyle={bookingStyle as BookingDailyStyleModel}
            onUpdate={onUpdateBookingStyle}
          />
        );
      case 'standard':
        return (
          <Standard
            bookingStyle={bookingStyle as BookingStandardStyleModel}
            onUpdate={onUpdateBookingStyle}
          />
        );
      case 'slot':
        return (
          <Slot
            bookingStyle={bookingStyle as BookingSlotStyleModel}
            onUpdate={onUpdateBookingStyle}
          />
        );
      case 'hourly':
        return (
          <Hourly
            bookingStyle={bookingStyle as BookingHourlyStyleModel}
            onUpdate={onUpdateBookingStyle}
          />
        );
      default:
        return (
          <Daily
            bookingStyle={bookingStyle as BookingDailyStyleModel}
            onUpdate={onUpdateBookingStyle}
          />
        );
    }
  };

  /**
   * render result
   */
  const buildResult = () => {
    return (
      <View style={Styles.columnCenter}>
        <View
          style={[
            styles.iconSuccess,
            {backgroundColor: theme.colors.primary.default},
          ]}>
          <Icon name="check" size={32} color="white" />
        </View>
        <SizedBox height={Spacing.M} />
        <Text typography="headline" fontWeight="bold">
          {translate('booking_success_title')}
        </Text>
        <SizedBox height={Spacing.S} />
        <Text typography="caption1" style={Styles.textCenter}>
          {translate('booking_success_message')}
        </Text>
      </View>
    );
  };

  /**
   * render contact form
   */
  const buildContact = () => {
    return (
      <View
        style={[
          Shadow.light,
          {
            backgroundColor: theme.colors.background.surface,
            padding: Spacing.M,
            borderRadius: Radius.M,
          },
        ]}>
        <Input
          ref={firstNameRef}
          defaultValue={firstName.current}
          leading={'account-outline'}
          floatingValue={translate('first_name')}
          placeholder={translate('input_first_name')}
          onChangeText={value => {
            firstName.current = value;
            const valid = validate(value, {empty: false});
            setError({...error, firstName: valid});
          }}
          onFocus={() => {
            setError({...error, firstName: null});
          }}
          onBlur={() => {
            const valid = validate(firstName.current, {empty: false});
            setError({...error, firstName: valid});
          }}
          onSubmitEditing={() => lastNameRef.current?.focus()}
          error={translate(error?.firstName)}
        />
        <SizedBox height={Spacing.M} />
        <Input
          ref={lastNameRef}
          defaultValue={lastName.current}
          leading={'account-outline'}
          floatingValue={translate('last_name')}
          placeholder={translate('input_last_name')}
          onChangeText={value => {
            lastName.current = value;
            const valid = validate(value, {empty: false});
            setError({...error, lastName: valid});
          }}
          onFocus={() => {
            setError({...error, lastName: null});
          }}
          onBlur={() => {
            const valid = validate(lastName.current, {empty: false});
            setError({...error, lastName: valid});
          }}
          onSubmitEditing={() => phoneRef.current?.focus()}
          error={translate(error?.lastName)}
        />
        <SizedBox height={Spacing.M} />
        <Input
          ref={phoneRef}
          defaultValue={phone.current}
          leading={'phone-outline'}
          floatingValue={translate('phone')}
          placeholder={translate('input_phone')}
          onChangeText={value => {
            phone.current = value;
            const valid = validate(value, {empty: false, number: true});
            setError({...error, phone: valid});
          }}
          onFocus={() => {
            setError({...error, phone: null});
          }}
          onBlur={() => {
            const valid = validate(phone.current, {
              empty: false,
              number: true,
            });
            setError({...error, phone: valid});
          }}
          onSubmitEditing={() => emailRef.current?.focus()}
          error={translate(error?.phone)}
          keyboardType="phone-pad"
        />
        <SizedBox height={Spacing.M} />
        <Input
          ref={emailRef}
          defaultValue={email.current}
          leading={'email-outline'}
          floatingValue={translate('email')}
          placeholder={translate('input_email')}
          onChangeText={value => {
            email.current = value;
            const valid = validate(value, {empty: false, email: true});
            setError({...error, email: valid});
          }}
          onFocus={() => {
            setError({...error, email: null});
          }}
          onBlur={() => {
            const valid = validate(email.current, {
              empty: false,
              email: true,
            });
            setError({...error, email: valid});
          }}
          onSubmitEditing={() => addressRef.current?.focus()}
          error={translate(error?.email)}
        />
        <SizedBox height={Spacing.M} />
        <Input
          ref={addressRef}
          defaultValue={address.current}
          leading={'map-marker-outline'}
          floatingValue={translate('address')}
          placeholder={translate('input_address')}
          onChangeText={value => {
            address.current = value;
            const valid = validate(value, {empty: false});
            setError({...error, address: valid});
          }}
          onFocus={() => {
            setError({...error, address: null});
          }}
          onBlur={() => {
            const valid = validate(address.current, {empty: false});
            setError({...error, address: valid});
          }}
          onSubmitEditing={() => contentRef.current?.focus()}
          error={translate(error?.address)}
        />
        <SizedBox height={Spacing.M} />
        <InputTextArea
          ref={contentRef}
          defaultValue={content.current}
          floatingValue={translate('message')}
          placeholder={translate('input_content')}
          onChangeText={value => {
            content.current = value;
          }}
          style={styles.textArea}
        />
      </View>
    );
  };

  /**
   * build form
   */
  const buildForm = () => {
    switch (step) {
      case 0:
        return buildInfo();
      case 1:
        return buildContact();
      case 3:
        return buildResult();
      default:
        return <View />;
    }
  };

  return (
    <Screen
      navigation={navigation}
      options={{title: translate('booking')}}
      scrollable={true}
      footerComponent={buildAction()}
      enableKeyboardAvoidingView={true}
      scrollViewProps={{
        contentContainerStyle: Styles.paddingM,
      }}>
      <View
        style={[
          Shadow.light,
          {
            backgroundColor: theme.colors.background.surface,
            padding: Spacing.M,
            borderRadius: Radius.M,
          },
        ]}>
        <Steps steps={steps} activeIndex={step} direction={'horizontal'} />
      </View>
      <SizedBox height={Spacing.M} />
      {buildForm()}
    </Screen>
  );
};

export {Booking};
