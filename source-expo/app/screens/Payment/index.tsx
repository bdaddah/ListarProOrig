import React, {useContext, useEffect, useState} from 'react';
import {
  ApplicationContext,
  Button,
  CheckBox,
  Divider,
  Radio,
  Screen,
  ScreenContainerProps,
  SizedBox,
  Spacing,
  Styles,
  Text,
} from '@passionui/components';
import {
  BankAccountModel,
  PaymentMethodModel,
  PaymentModel,
  WebViewModel,
} from '@models+types';
import {View} from 'react-native';
import styles from './styles';
import {Web} from '@screens';
import {listingActions} from '@redux';

const Payment: React.FC<ScreenContainerProps> = ({navigation, onPayment}) => {
  const {navigator, translate, theme} = useContext(ApplicationContext);
  const [payment, setPayment] = useState<PaymentModel>();
  const [method, setMethod] = useState<PaymentMethodModel>();
  const [agree, setAgree] = useState(false);

  useEffect(() => {
    listingActions.onPayment(data => {
      setPayment(data);
      setMethod(data.listMethod?.[0]);
    });
  }, []);
  /**
   * On Payment
   */
  const onConfirm = async () => {
    const link = await onPayment(method);
    if (link) {
      navigator?.push({
        screen: Web,
        item: new WebViewModel({
          url: link,
          title: method?.title,
          handlerUrl: ['return', 'cancel'],
          callbackUrl: (value: string) => {
            const isSuccess = value === 'return';
            navigator?.pop();
            navigator?.showToast({
              message: isSuccess
                ? 'booking_success_title'
                : 'payment_not_completed',
              type: isSuccess ? 'success' : 'warning',
            });
          },
          clearCookie: true,
        }),
      });
    } else {
      navigator?.pop();
    }
  };

  /**
   * On Term
   */
  const onTerm = () => {
    navigator?.push({
      screen: Web,
      item: new WebViewModel({
        url: payment?.term,
        title: translate('term_condition'),
      }),
    });
  };

  return (
    <Screen
      navigation={navigation}
      options={{title: translate('payment')}}
      scrollable={true}
      footerComponent={
        <View>
          <View style={Styles.row}>
            <CheckBox
              value={agree}
              onChange={setAgree}
              label={translate('i_agree')}
            />
            <Button
              title={translate('term_condition')}
              onPress={onTerm}
              size={'small'}
              full={false}
              type={'text'}
              color={theme.colors.secondary.default}
            />
          </View>
          <SizedBox height={Spacing.M} />
          <Button
            onPress={onConfirm}
            title={translate('confirm')}
            type={agree ? 'primary' : 'disabled'}
          />
        </View>
      }
      enableKeyboardAvoidingView={true}>
      <View
        style={[
          Styles.paddingM,
          {backgroundColor: theme.colors.background.surface},
        ]}>
        {payment?.listMethod?.map((item: PaymentMethodModel, index: number) => {
          return (
            <View key={`payment${item.id ?? index}`}>
              {index !== 0 && <Divider />}
              <View style={[Styles.row, Styles.paddingVerticalM]}>
                <Radio
                  value={item.id}
                  groupValue={method?.id ?? 'unknown'}
                  onChange={() => setMethod(item)}
                />
                <SizedBox width={Spacing.S} />
                <View style={Styles.flex}>
                  <Text typography="subhead" fontWeight={'semibold'}>
                    {item.title}
                  </Text>
                  <SizedBox height={Spacing.XXS} />
                  <Text typography="caption2">{item.instruction}</Text>
                </View>
              </View>
            </View>
          );
        })}
        {method && (
          <View
            style={[
              styles.paymentInfo,
              {backgroundColor: theme.colors.background.disable},
            ]}>
            <Text typography="headline" fontWeight="bold">
              {method.title}
            </Text>
            <SizedBox height={Spacing.S} />
            <Text typography="caption2" color={theme.colors.text.secondary}>
              {method.description}
            </Text>
            <SizedBox height={Spacing.S} />
            <Text typography="subhead">{method.instruction}</Text>
          </View>
        )}
        {method?.id === 'bank' &&
          payment?.listAccount?.map((item: BankAccountModel, index: number) => {
            return (
              <View key={`bank${item?.bankCode ?? index}`}>
                {index !== 0 && <Divider />}
                <View style={Styles.paddingVerticalM}>
                  <Text typography="subhead" fontWeight="bold">
                    {item.bankName}
                  </Text>
                  <SizedBox height={Spacing.S} />
                  <View style={Styles.row}>
                    <View style={Styles.flex}>
                      <Text
                        typography="caption2"
                        color={theme.colors.text.secondary}>
                        {translate('account_name')}
                      </Text>
                      <SizedBox height={Spacing.XS} />
                      <Text typography="caption1" fontWeight={'bold'}>
                        {item.name}
                      </Text>
                    </View>
                    <View style={Styles.flex}>
                      <Text
                        typography="caption2"
                        color={theme.colors.text.secondary}>
                        {translate('account_number')}
                      </Text>
                      <SizedBox height={Spacing.XS} />
                      <Text typography="caption1" fontWeight={'bold'}>
                        {item.number}
                      </Text>
                    </View>
                  </View>
                  <SizedBox height={Spacing.S} />
                  <View style={Styles.row}>
                    <View style={Styles.flex}>
                      <Text
                        typography="caption2"
                        color={theme.colors.text.secondary}>
                        {translate('iban_code')}
                      </Text>
                      <SizedBox height={Spacing.XS} />
                      <Text typography="caption1" fontWeight={'bold'}>
                        {item.bankIban}
                      </Text>
                    </View>
                    <View style={Styles.flex}>
                      <Text
                        typography="caption2"
                        color={theme.colors.text.secondary}>
                        {translate('swift_code')}
                      </Text>
                      <SizedBox height={Spacing.XS} />
                      <Text typography="caption1" fontWeight={'bold'}>
                        {item.bankSwift}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
      </View>
    </Screen>
  );
};

export {Payment};
