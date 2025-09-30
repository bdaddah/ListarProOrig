import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  ApplicationContext,
  Button,
  Input,
  InputRef,
  Screen,
  ScreenContainerProps,
  SizedBox,
  Spacing,
  Styles,
} from '@passionui/components';
import {Keyboard, View} from 'react-native';
import {useSelector} from 'react-redux';
import {validate} from '@utils';
import {authenticationActions, userSelect} from '@redux';
import {ForgotPassword, OTPVerification, SignUp} from '@screens';
import styles from './styles';

const SignIn: React.FC<ScreenContainerProps> = ({navigation, options}) => {
  const {theme, navigator, translate} = useContext(ApplicationContext);
  const usernameRef = useRef<InputRef>();
  const passwordRef = useRef<InputRef>();

  const username = useRef('paul');
  const password = useRef('123456@listar');
  const [error, setError] = useState<any>({
    username: null,
    password: null,
  });

  /**
   * autofocus username when screen loaded
   */
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
    if (error.username !== valid) {
      setError({...error, username: valid});
    }
  };

  /**
   * on change password
   * @param {*} value
   */
  const onChangePassword = (value: string) => {
    const valid = validate(value, {empty: false});
    password.current = value;
    if (error.password !== valid) {
      setError({...error, password: valid});
    }
  };

  /**
   * on verify
   * @param otp
   */
  const onVerify = (otp?: string) => {
    return new Promise<any>(resolve => {
      Keyboard.dismiss();
      authenticationActions.onLogin(
        {
          username: username.current,
          password: password.current,
          code: otp,
        },
        resolve,
      );
    });
  };

  /**
   * on confirm login
   */
  const onConfirm = async () => {
    const result = await onVerify();
    if (result.code === 'auth_otp_require') {
      navigator?.push({
        screen: OTPVerification,
        email: result.email,
        onVerify: onVerify,
      });
    }
  };

  /**
   * on forgot password
   */
  const onForgotPassword = () => {
    navigator?.push({screen: ForgotPassword});
  };

  /**
   * on sign up
   */
  const onSignUp = () => {
    navigator?.push({
      screen: SignUp,
      onSignIn: (data: {username: string; password: string}) => {
        usernameRef.current?.setText(data.username);
        passwordRef.current?.setText(data.password);
        onConfirm().then();
      },
    });
  };

  /**
   * check disable sign in
   */
  const disableSignIn = () => {
    const validUsername = validate(username.current, {empty: false});
    const validPassword = validate(password.current, {empty: false});
    if (validUsername || validPassword) {
      return true;
    }
  };

  return (
    <Screen
      navigation={navigation}
      options={{
        ...options,
        title: translate('sign_in'),
        headerRight: () => null,
      }}
      enableKeyboardAvoidingView={true}
      scrollable={true}
      scrollViewProps={{
        contentContainerStyle: [Styles.paddingM, Styles.flexCenter],
      }}
      style={{backgroundColor: theme.colors.background.surface}}>
      <Input
        ref={usernameRef}
        leading={'account-circle-outline'}
        defaultValue={username.current}
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
        leading={'lock-outline'}
        defaultValue={password.current}
        floatingValue={translate('password')}
        placeholder={translate('input_password')}
        secureTextEntry={true}
        onChangeText={onChangePassword}
        onFocus={() => {
          setError({...error, password: null});
        }}
        onBlur={() => onChangePassword(password.current)}
        error={translate(error.password)}
      />
      <SizedBox height={Spacing.M} />
      <Button
        onPress={onConfirm}
        type={disableSignIn() ? 'disabled' : 'primary'}
        title={translate('sign_in')}
      />
      <SizedBox height={Spacing.M} />
      <View style={styles.action}>
        <Button
          full={false}
          type={'text'}
          size={'small'}
          onPress={onForgotPassword}
          title={translate('forgot_password')}
        />
        <Button
          full={false}
          type={'text'}
          size={'small'}
          onPress={onSignUp}
          title={translate('sign_up')}
        />
      </View>
    </Screen>
  );
};

const Authentication: React.FC<ScreenContainerProps> = props => {
  const {navigator} = useContext(ApplicationContext);
  const user = useSelector(userSelect);

  useEffect(() => {
    if (user && !props.screen) {
      navigator?.pop();
    }
    props.onLogin?.();
  }, [navigator, props, user]);

  if (user && props.screen) {
    const Component = props.screen;
    return <Component {...props} />;
  }

  return <SignIn {...props} />;
};

export {Authentication};
