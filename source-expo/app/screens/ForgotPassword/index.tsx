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
import {OTPVerification, SetNewPassword} from '@screens';

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
   * on verify OTP code
   * @param otp
   */
  const onVerify = (otp?: string) => {
    return new Promise<any>(resolve => {
      Keyboard.dismiss();
      authenticationActions.onForgot(
        {email: email.current, code: otp},
        result => {
          // If OTP is verified and we have a reset token, navigate to set new password
          if (result.success && result.data?.reset_token) {
            navigator?.push({
              screen: SetNewPassword,
              email: email.current,
              resetToken: result.data.reset_token,
              onSuccess: () => {
                // Pop back to authentication screen after password reset
                navigator?.popToTop();
              },
            });
          }
          resolve(result);
        },
      );
    });
  };

  /**
   * on confirm - request OTP
   */
  const onConfirm = async () => {
    Keyboard.dismiss();
    authenticationActions.onForgot({email: email.current}, result => {
      if (result.code === 'auth_otp_require') {
        // Navigate to OTP verification screen
        navigator?.push({
          screen: OTPVerification,
          email: email.current,
          onVerify: onVerify,
          onSuccess: () => {
            // This is called after OTP is verified and password is reset
            navigator?.popToTop();
          },
        });
      }
    });
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
