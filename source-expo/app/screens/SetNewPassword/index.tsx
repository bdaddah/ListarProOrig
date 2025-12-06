import React, {useContext, useRef, useState} from 'react';
import {Keyboard, View} from 'react-native';
import {validate} from '@utils';
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
import {authenticationActions} from '@redux';

interface SetNewPasswordProps extends ScreenContainerProps {
  email: string;
  resetToken: string;
  onSuccess?: () => void;
}

const SetNewPassword: React.FC<SetNewPasswordProps> = ({
  navigation,
  email,
  resetToken,
  onSuccess,
}) => {
  const {theme, navigator, translate} = useContext(ApplicationContext);
  const passwordRef = useRef<InputRef>();
  const rePasswordRef = useRef<InputRef>();
  const password = useRef('');
  const rePassword = useRef('');
  const [error, setError] = useState<any>({
    password: null,
    rePassword: null,
  });

  const onChangePassword = (value: string) => {
    const valid = validate(value, {empty: false, min: 6});
    password.current = value;
    setError({...error, password: valid});
  };

  const onChangeRePassword = (value: string) => {
    const valid = validate(value, {empty: false, match: password.current});
    rePassword.current = value;
    setError({...error, rePassword: valid});
  };

  /**
   * on submit new password
   */
  const onSubmit = () => {
    Keyboard.dismiss();
    authenticationActions.onSetNewPassword(
      {
        email,
        token: resetToken,
        new_password: password.current,
      },
      result => {
        if (result.success) {
          // Pop back to login screen
          navigator?.popToTop();
          onSuccess?.();
        }
      },
    );
  };

  /**
   * check disable submit button
   */
  const disableSubmit = () => {
    const validPassword = validate(password.current, {empty: false, min: 6});
    const validRePassword = validate(rePassword.current, {
      empty: false,
      match: password.current,
    });

    return !!(validPassword || validRePassword);
  };

  return (
    <Screen
      navigation={navigation}
      enableKeyboardAvoidingView={true}
      options={{title: translate('set_new_password')}}
      scrollable={true}
      style={Styles.paddingM}
      footerComponent={
        <Button
          title={translate('confirm')}
          onPress={onSubmit}
          type={disableSubmit() ? 'disabled' : 'primary'}
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
        <Text typography="footnote">{translate('set_new_password_tour')}</Text>
        <SizedBox height={Spacing.M} />
        <Input
          ref={passwordRef}
          defaultValue={password.current}
          leading={'lock-outline'}
          floatingValue={translate('new_password')}
          placeholder={translate('input_new_password')}
          onChangeText={onChangePassword}
          secureTextEntry={true}
          onFocus={() => {
            setError({...error, password: null});
          }}
          onBlur={() => onChangePassword(password.current)}
          onSubmitEditing={() => rePasswordRef.current?.focus()}
          error={translate(error.password)}
        />
        <SizedBox height={Spacing.M} />
        <Input
          ref={rePasswordRef}
          defaultValue={rePassword.current}
          leading={'lock-outline'}
          floatingValue={translate('confirm_password')}
          placeholder={translate('input_confirm_password')}
          onChangeText={onChangeRePassword}
          secureTextEntry={true}
          onFocus={() => {
            setError({...error, rePassword: null});
          }}
          onBlur={() => onChangeRePassword(rePassword.current)}
          error={translate(error.rePassword)}
        />
      </View>
    </Screen>
  );
};

export {SetNewPassword};
