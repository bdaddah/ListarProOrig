import React, {useContext, useRef, useState} from 'react';
import {View} from 'react-native';
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
  Styles,
  Text,
} from '@passionui/components';
import {UserModel} from '@models+types';
import {useSelector} from 'react-redux';
import {claimActions, userSelect} from '@redux';
import {validate} from '@utils';
import styles from './styles';
import {ClaimManagement} from '@screens';

const Claim: React.FC<ScreenContainerProps> = ({navigation, item}) => {
  const {navigator, theme, translate} = useContext(ApplicationContext);
  const user: UserModel = useSelector(userSelect);

  const [success, setSuccess] = useState(false);
  const firstNameRef = useRef<InputRef>();
  const lastNameRef = useRef<InputRef>();
  const phoneRef = useRef<InputRef>();
  const emailRef = useRef<InputRef>();
  const contentRef = useRef<InputRef>();
  const firstName = useRef(user.firstName);
  const lastName = useRef(user.lastName);
  const phone = useRef('');
  const email = useRef(user.email);
  const content = useRef('');
  const [error, setError] = useState<any>({});

  /**
   * Handle submit
   */
  const onSubmit = () => {
    const issue = {
      firstName: validate(firstName.current, {empty: false}),
      lastName: validate(lastName.current, {empty: false}),
      phone: validate(phone.current, {empty: false, number: true}),
      email: validate(email.current, {empty: false, email: true}),
      content: validate(content.current, {empty: false}),
    };
    setError(issue);
    const valid = Object.values(issue).some(i => i !== undefined);
    if (valid) {
      return;
    }
    claimActions.onSubmit(
      item,
      {
        firstName: firstName.current,
        lastName: lastName.current,
        phone: phone.current,
        email: email.current,
        content: content.current,
      },
      () => {
        setSuccess(true);
      },
    );
  };

  /**
   * on claim management
   */
  const onClaimManagement = () => {
    navigator?.replace({screen: ClaimManagement});
  };

  /**
   * Build action button
   */
  const buildAction = () => {
    if (success) {
      return (
        <Button
          onPress={onClaimManagement}
          title={translate('claim_management')}
        />
      );
    }
    return <Button onPress={onSubmit} title={translate('submit')} />;
  };

  /**
   * Build content
   */
  const buildContent = () => {
    if (success) {
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
          <View style={[Styles.columnCenter, Styles.flex]}>
            <View
              style={[
                styles.iconSuccess,
                {backgroundColor: theme.colors.primary.default},
              ]}>
              <Icon name="check" size={32} color="white" />
            </View>
            <SizedBox height={Spacing.M} />
            <Text typography="headline" fontWeight="bold">
              {translate('claim_success_title')}
            </Text>
            <SizedBox height={Spacing.S} />
            <Text typography="caption1" style={Styles.textCenter}>
              {translate('claim_success_message')}
            </Text>
          </View>
        </View>
      );
    }

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
          <Text typography={'subhead'} fontWeight={'bold'}>
            {item.title}
          </Text>
          <SizedBox height={Spacing.XS} />
          <Text typography={'caption1'} color={theme.colors.text.secondary}>
            {item.address}
          </Text>
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
            {translate('your_information')}
          </Text>
          <SizedBox height={Spacing.M} />
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
            onSubmitEditing={() => contentRef.current?.focus()}
            error={translate(error?.email)}
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
          <SizedBox height={Spacing.M} />
          <Text typography={'caption1'} color={theme.colors.secondary.default}>
            {translate('claim_success_message')}
          </Text>
        </View>
      </>
    );
  };

  return (
    <Screen
      navigation={navigation}
      options={{title: translate('claim')}}
      scrollable={true}
      footerComponent={buildAction()}
      enableKeyboardAvoidingView={true}
      scrollViewProps={{
        contentContainerStyle: Styles.paddingM,
      }}>
      {buildContent()}
    </Screen>
  );
};

export {Claim};
