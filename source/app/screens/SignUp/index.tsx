import React, {useContext, useEffect, useRef, useState} from 'react';
import {Keyboard, View} from 'react-native';
import {validate} from '@utils';
import {authenticationActions} from '@redux';

import {
  ApplicationContext,
  Button,
  Input,
  Screen,
  ScreenContainerProps,
  SizedBox,
  Spacing,
  Styles,
  Text,
  InputRef,
  Shadow,
  Radius,
} from '@passionui/components';

const SignUp: React.FC<ScreenContainerProps> = ({navigation, onSignIn}) => {
  const {theme, navigator, translate} = useContext(ApplicationContext);
  const usernameRef = useRef<InputRef>();
  const passwordRef = useRef<InputRef>();
  const emailRef = useRef<InputRef>();
  const username = useRef('');
  const password = useRef('');
  const email = useRef('');
  const [error, setError] = useState<any>({
    username: undefined,
    password: undefined,
    email: undefined,
  });

  useEffect(() => {
    setTimeout(() => {
      usernameRef.current?.focus();
    }, 500);
  }, []);

  /**
   * on change username
   * @param {*} value
   */
  const onChangeUsername = (value: string) => {
    const valid = validate(value, {empty: false});
    username.current = value;
    setError({...error, username: valid});
  };

  /**
   * on change password
   * @param {*} value
   */
  const onChangePassword = (value: string) => {
    const valid = validate(value, {empty: false});
    password.current = value;
    setError({...error, password: valid});
  };

  /**
   * on change email
   * @param {*} value
   */
  const onChangeEmail = (value: string) => {
    const valid = validate(value, {empty: false, email: true});
    email.current = value;
    setError({...error, email: valid});
  };

  /**
   * on sign up
   */
  const onSignUp = () => {
    Keyboard.dismiss();
    authenticationActions.onRegister(
      {
        username: username.current,
        password: password.current,
        email: email.current,
      },
      () => {
        navigator?.pop();
        onSignIn({username: username.current, password: password.current});
      },
    );
  };

  /**
   * check disable sign up
   */
  const disableSignUp = () => {
    const validUsername = validate(username.current, {empty: false});
    const validPassword = validate(password.current, {empty: false});
    const validEmail = validate(email.current, {empty: false, email: true});
    if (validUsername || validPassword || validEmail) {
      return true;
    }
  };

  return (
    <Screen
      navigation={navigation}
      enableKeyboardAvoidingView={true}
      options={{title: translate('sign_up')}}
      scrollable={true}
      style={Styles.paddingM}
      footerComponent={
        <Button
          title={translate('sign_up')}
          onPress={onSignUp}
          type={disableSignUp() ? 'disabled' : 'primary'}
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
        <Text typography="callout" fontWeight={'semibold'}>
          {translate('welcome')}
        </Text>
        <SizedBox height={Spacing.XS} />
        <Text typography="footnote">{translate('sign_up_tour')}</Text>
        <SizedBox height={Spacing.M} />
        <Input
          ref={usernameRef}
          defaultValue={username.current}
          leading={'account-circle-outline'}
          floatingValue={translate('account')}
          placeholder={translate('input_account')}
          onChangeText={onChangeUsername}
          onFocus={() => {
            setError({...error, username: null});
          }}
          onBlur={() => onChangeUsername(username.current)}
          onSubmitEditing={() => passwordRef.current?.focus()}
          error={translate(error.username)}
        />
        <SizedBox height={Spacing.M} />
        <Input
          ref={passwordRef}
          defaultValue={password.current}
          leading={'lock-outline'}
          floatingValue={translate('password')}
          placeholder={translate('input_password')}
          onChangeText={onChangePassword}
          onFocus={() => {
            setError({...error, password: null});
          }}
          secureTextEntry={true}
          onBlur={() => onChangePassword(password.current)}
          onSubmitEditing={() => emailRef.current?.focus()}
          error={translate(error.password)}
        />
        <SizedBox height={Spacing.M} />
        <Input
          ref={emailRef}
          defaultValue={email.current}
          leading={'email-outline'}
          floatingValue={translate('email')}
          placeholder={translate('input_email')}
          onChangeText={onChangeEmail}
          onFocus={() => {
            setError({...error, email: null});
          }}
          onBlur={() => onChangeEmail(email.current)}
          error={translate(error.email)}
        />
      </View>
    </Screen>
  );
};

export {SignUp};
