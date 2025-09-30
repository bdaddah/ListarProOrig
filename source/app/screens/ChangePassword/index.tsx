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

const ChangePassword: React.FC<ScreenContainerProps> = ({navigation}) => {
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
    const valid = validate(value, {empty: false});
    password.current = value;
    setError({...error, password: valid});
  };

  const onChangeRePassword = (value: string) => {
    const valid = validate(value, {empty: false, match: password.current});
    rePassword.current = value;
    setError({...error, rePassword: valid});
  };

  /**
   * on next
   */
  const onSubmit = () => {
    Keyboard.dismiss();
    authenticationActions.onChangePassword({password: password.current}, () => {
      navigator?.pop();
    });
  };

  /**
   * check disable next step
   */
  const disableSubmit = () => {
    const validPassword = validate(password.current, {empty: false});
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
      options={{title: translate('change_password')}}
      scrollable={true}
      style={Styles.paddingM}
      footerComponent={
        <Button
          title={translate('update')}
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
        <Text typography="footnote">{translate('change_password_tour')}</Text>
        <SizedBox height={Spacing.M} />
        <Input
          ref={passwordRef}
          defaultValue={password.current}
          leading={'lock-outline'}
          floatingValue={translate('password')}
          placeholder={translate('input_password')}
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
          floatingValue={translate('password')}
          placeholder={translate('input_password')}
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

export {ChangePassword};
