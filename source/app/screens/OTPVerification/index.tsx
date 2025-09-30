import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ApplicationContext,
  Button,
  InputOTP,
  InputRef,
  Popup,
  Screen,
  ScreenContainerProps,
  Shadow,
  SizedBox,
  Spacing,
  Styles,
  Text,
} from '@passionui/components';
import {View} from 'react-native';
import {validate} from '@utils';
import {authenticationActions} from '@redux';
import styles from './styles';

const OTPVerification: React.FC<ScreenContainerProps> = ({
  navigation,
  email,
  onVerify,
  onSuccess,
}) => {
  const {navigator, translate, theme} = useContext(ApplicationContext);
  const otpRef = useRef<InputRef>();
  const otp = useRef('');
  const interval = useRef<any>();
  const [time, setTime] = useState(0);
  const [error, setError] = useState<string>();

  /**
   * otp request
   */
  const onRequestOTP = useCallback(() => {
    authenticationActions.onRequestOTP({email}, life => {
      otpRef.current?.clear();
      setTime(life);
      clearInterval(interval.current);
      interval.current = setInterval(() => {
        setTime(prev => {
          if (prev === 0) {
            clearInterval(interval.current);
          }
          return prev - 1;
        });
      }, 1000);
    });

    return () => {
      clearInterval(interval.current);
    };
  }, [email]);

  useEffect(() => {
    onRequestOTP();
  }, [onRequestOTP]);

  /**
   * on get otp
   */
  const onResend = () => {
    navigator?.showModal({
      screen: () => (
        <Popup
          title={translate('notice')}
          description={
            <View style={Styles.row}>
              <Text typography={'subhead'} numberOfLines={3}>
                {translate('otp_message')}
                <Text
                  typography={'subhead'}
                  fontWeight={'bold'}
                  color={theme.colors.secondary.default}>
                  {email.current}
                </Text>
              </Text>
            </View>
          }
          primary={{
            title: translate('confirm'),
            onPress: onRequestOTP,
          }}
          secondary={{
            title: translate('cancel'),
            onPress: () => {},
          }}
        />
      ),
    });
  };

  /**
   * on change
   */
  const onChange = (value: string) => {
    otp.current = value;
    const issue = validate(value, {empty: false, length: 6});
    if (issue !== error) {
      setError(issue);
    }
    if (!issue && otp.current.length === 6) {
      onConfirm().then();
    }
  };

  /**
   * on confirm
   */
  const onConfirm = async () => {
    const result = await onVerify(otp.current);
    if (result.success) {
      navigator?.pop();
      onSuccess?.();
    } else {
      setError(result.code);
    }
  };

  return (
    <Screen
      navigation={navigation}
      enableKeyboardAvoidingView={true}
      options={{title: translate('otp_verification')}}
      scrollable={true}
      style={Styles.paddingM}
      footerComponent={
        <Button
          onPress={onConfirm}
          type={!error && otp.current.length === 6 ? 'primary' : 'disabled'}
          title={translate('confirm')}
        />
      }>
      <View
        style={[
          Shadow.light,
          styles.form,
          {
            backgroundColor: theme.colors.background.surface,
          },
        ]}>
        <Text typography="footnote">{translate('otp_sent')}</Text>
        <SizedBox height={Spacing.S} />
        <Text typography="subhead" fontWeight={'bold'}>
          {email}
        </Text>
        <SizedBox height={Spacing.M} />
        <InputOTP
          ref={otpRef}
          defaultValue={otp.current}
          floatingValue={translate('otp')}
          onChangeText={onChange}
          length={6}
          error={translate(error ?? '')}
          onFocus={() => {
            setError(undefined);
          }}
        />
        <SizedBox height={Spacing.M} />
        {time > 0 ? (
          <View style={Styles.rowSpace}>
            <Text typography={'footnote'}>{translate('otp_resend')}</Text>
            <SizedBox width={Spacing.XS} />
            <Text
              typography={'footnote'}
              fontWeight={'bold'}
              color={theme.colors.primary.default}>
              {time}
            </Text>
            <SizedBox width={Spacing.XS} />
            <Text typography={'caption2'}>{translate('second')}</Text>
          </View>
        ) : (
          <View style={Styles.rowSpace}>
            <Text typography={'footnote'}>{translate('otp_again')}</Text>
            <Button
              title={translate('resend')}
              onPress={onResend}
              type={'text'}
              size={'medium'}
              full={false}
            />
          </View>
        )}
      </View>
    </Screen>
  );
};

export {OTPVerification};
