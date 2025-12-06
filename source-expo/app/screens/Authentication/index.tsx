import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  ApplicationContext,
  Button,
  Icon,
  Input,
  InputRef,
  Screen,
  ScreenContainerProps,
  SizedBox,
  Spacing,
  Styles,
  Text,
} from '@passionui/components';
import {Keyboard, Platform, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {validate} from '@utils';
import {authenticationActions, userSelect} from '@redux';
import {ForgotPassword, OTPVerification, SignUp} from '@screens';
import styles from './styles';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as WebBrowser from 'expo-web-browser';

// Enable web browser for OAuth
WebBrowser.maybeCompleteAuthSession();

// Social provider colors
const SOCIAL_COLORS = {
  google: '#DB4437',
  facebook: '#4267B2',
  twitter: '#1DA1F2',
  yahoo: '#6001D2',
  apple: '#000000',
};

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

  // Google OAuth hook
  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    // These should come from your app.json or environment
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    webClientId: 'YOUR_WEB_CLIENT_ID',
  });

  // Facebook OAuth hook
  const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
    clientId: 'YOUR_FACEBOOK_APP_ID',
  });

  // Handle Google response
  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const {authentication} = googleResponse;
      if (authentication?.idToken) {
        handleSocialLogin('google', authentication.accessToken, authentication.idToken);
      }
    }
  }, [googleResponse]);

  // Handle Facebook response
  useEffect(() => {
    if (fbResponse?.type === 'success') {
      const {authentication} = fbResponse;
      if (authentication?.accessToken) {
        handleSocialLogin('facebook', authentication.accessToken);
      }
    }
  }, [fbResponse]);

  /**
   * Handle social login
   */
  const handleSocialLogin = (
    provider: 'google' | 'facebook' | 'twitter' | 'yahoo' | 'apple',
    accessToken?: string,
    idToken?: string,
    userData?: {firstName?: string; lastName?: string; displayName?: string},
  ) => {
    authenticationActions.onSocialLogin(
      {
        provider,
        access_token: accessToken,
        id_token: idToken,
        user_data: userData,
      },
      result => {
        if (!result.success) {
          console.log('Social login failed:', result.message);
        }
      },
    );
  };

  /**
   * Handle Apple Sign In
   */
  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential.identityToken) {
        handleSocialLogin(
          'apple',
          undefined,
          credential.identityToken,
          {
            firstName: credential.fullName?.givenName ?? undefined,
            lastName: credential.fullName?.familyName ?? undefined,
          },
        );
      }
    } catch (e: any) {
      if (e.code !== 'ERR_CANCELED') {
        console.log('Apple Sign In Error:', e);
      }
    }
  };

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
      <SizedBox height={Spacing.L} />
      {/* Social Login Divider */}
      <View style={styles.divider}>
        <View style={[styles.dividerLine, {backgroundColor: theme.colors.divider}]} />
        <Text style={styles.dividerText} typography="caption" color="secondary">
          {translate('or_sign_in_with')}
        </Text>
        <View style={[styles.dividerLine, {backgroundColor: theme.colors.divider}]} />
      </View>
      <SizedBox height={Spacing.M} />
      {/* Social Login Buttons */}
      <View style={styles.socialContainer}>
        {/* Google */}
        <TouchableOpacity
          style={[styles.socialButton, {backgroundColor: SOCIAL_COLORS.google}]}
          onPress={() => googlePromptAsync()}
          disabled={!googleRequest}>
          <Icon name="google" color="#FFFFFF" size={24} />
        </TouchableOpacity>
        {/* Facebook */}
        <TouchableOpacity
          style={[styles.socialButton, {backgroundColor: SOCIAL_COLORS.facebook}]}
          onPress={() => fbPromptAsync()}
          disabled={!fbRequest}>
          <Icon name="facebook" color="#FFFFFF" size={24} />
        </TouchableOpacity>
        {/* Apple - iOS only */}
        {Platform.OS === 'ios' && (
          <TouchableOpacity
            style={[styles.socialButton, {backgroundColor: SOCIAL_COLORS.apple}]}
            onPress={handleAppleSignIn}>
            <Icon name="apple" color="#FFFFFF" size={24} />
          </TouchableOpacity>
        )}
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
