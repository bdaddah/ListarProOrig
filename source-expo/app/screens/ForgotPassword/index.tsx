import React, {useContext, useEffect, useRef, useState} from 'react';
import {Keyboard, View} from 'react-native';

import {validate} from '@utils';
import {
  ApplicationContext,
  Button,
  Input,
  InputRef,
  Radius,
  Screen,
  ScreenContainerProps,
  Shadow,
  SizedBox,
  Spacing,
  Styles,
  Text,
} from '@passionui/components';
import {authenticationActions} from '@redux';
import {OTPVerification} from '@screens';

const ForgotPassword: React.FC<ScreenContainerProps> = ({navigation}) => {
  const {theme, navigator, translate} = useContext(ApplicationContext);
  const emailRef = useRef<InputRef>();
  const email = useRef('');
  const [error, setError] = useState<any>();

  useEffect(() => {
    setTimeout(() => {
      emailRef.current?.focus();
    }, 500);
  }, []);

  /**
   * on change email
   * @param {*} value
   */
  const onChangeEmail = (value: string) => {
    const valid = validate(value, {empty: false, email: true});
    email.current = value;
    setError(valid);
  };

  /**
   * on verify
   * @param otp
   */
  const onVerify = (otp?: string) => {
    return new Promise<any>(resolve => {
      Keyboard.dismiss();
      authenticationActions.onForgot(
        {email: email.current, code: otp},
        resolve,
      );
    });
  };

  /**
   * on confirm
   */
  const onConfirm = async () => {
    const result = await onVerify();
    if (result.success) {
      navigator?.pop();
    } else if (result.code === 'auth_otp_require') {
      navigator?.push({
        screen: OTPVerification,
        email: email.current,
        onVerify: onVerify,
        onSuccess: () => {
          navigator?.pop();
        },
      });
    }
  };

  /**
   * check disable next step
   */
  const disableNext = () => {
    const valid = validate(email.current, {empty: false, email: true});
    return !!valid;
  };

  return (
    <Screen
      navigation={navigation}
      enableKeyboardAvoidingView={true}
      options={{title: translate('forgot_password')}}
      scrollable={true}
      style={Styles.paddingM}
      footerComponent={
        <Button
          onPress={onConfirm}
          type={disableNext() ? 'disabled' : 'primary'}
          title={translate('reset_password')}
        />
      }>
      <View
        style={[
          Shadow.light,
          {
            backgroundColor: theme.colors.background.surface,
            padding: Spacing.M,
            borderRadius: Radius.M,
          },
        ]}>
        <Text typography="footnote">{translate('forgot_password_tour')}</Text>
        <SizedBox height={Spacing.M} />
        <Input
          ref={emailRef}
          defaultValue={email.current}
          leading={'email-outline'}
          floatingValue={translate('email')}
          placeholder={translate('input_email')}
          onChangeText={onChangeEmail}
          onFocus={() => {
            setError(undefined);
          }}
          onBlur={() => onChangeEmail(email.current)}
          error={translate(error)}
        />
      </View>
    </Screen>
  );
};

export {ForgotPassword};
