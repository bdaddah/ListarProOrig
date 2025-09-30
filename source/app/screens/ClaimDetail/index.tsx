import React, {useContext, useEffect, useState} from 'react';
import {
  ApplicationContext,
  Button,
  Radius,
  Screen,
  ScreenContainerProps,
  Shadow,
  SizedBox,
  Spacing,
  Styles,
  Text,
} from '@passionui/components';
import {View} from 'react-native';
import {claimActions} from '@redux';
import {ClaimModel, PaymentMethodModel} from '@models+types';
import styles from './styles';
import {Payment} from '@screens';

const ClaimDetail: React.FC<ScreenContainerProps> = ({navigation, item}) => {
  const {navigator, theme, translate} = useContext(ApplicationContext);
  const [detail, setDetail] = useState<ClaimModel>();

  useEffect(() => {
    claimActions.onDetail(item, setDetail);
  }, [item]);

  /**
   * on cancel
   */
  const onCancel = () => {
    claimActions.onCancel(item, setDetail);
  };

  /**
   * on accept
   */
  const onAccept = () => {
    claimActions.onAccept(item, setDetail);
  };

  /**
   * on payment
   */
  const onPayment = () => {
    navigator?.push({
      screen: Payment,
      onPayment: (method: PaymentMethodModel) => {
        return new Promise(resolve => {
          claimActions.onPayment(item, method, url => {
            resolve?.(url);
          });
        });
      },
    });
  };
  /**
   * render content
   */
  const renderContent = () => {
    if (detail) {
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
            <Text typography="subhead" fontWeight="bold">
              {detail.title}
            </Text>
            <SizedBox height={Spacing.XS} />
            <Text
              typography="caption1"
              color={theme.colors.text.secondary}
              numberOfLines={1}>
              {detail.address || item.address}
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
            <View style={Styles.row}>
              <View style={Styles.flex}>
                <Text typography="caption2" color={theme.colors.text.secondary}>
                  {translate('payment')}
                </Text>
                <SizedBox height={Spacing.XS} />
                <Text typography="footnote" fontWeight={'semibold'}>
                  {translate(detail.payment ?? '')}
                </Text>
              </View>
              <SizedBox width={8} />
              <View style={Styles.flex}>
                <Text typography="caption2" color={theme.colors.text.secondary}>
                  {translate('payment_method')}
                </Text>
                <SizedBox height={Spacing.XS} />
                <Text typography="footnote" fontWeight={'semibold'}>
                  {detail.paymentName}
                </Text>
              </View>
            </View>
            <SizedBox height={Spacing.M} />
            <View style={Styles.row}>
              <View style={Styles.flex}>
                <Text typography="caption2" color={theme.colors.text.secondary}>
                  {translate('transaction_id')}
                </Text>
                <SizedBox height={Spacing.XS} />
                <Text typography="footnote" fontWeight={'semibold'}>
                  {detail.transactionID ?? '-'}
                </Text>
              </View>
              <SizedBox width={8} />
              <View style={Styles.flex}>
                <Text typography="caption2" color={theme.colors.text.secondary}>
                  {translate('created_on')}
                </Text>
                <SizedBox height={Spacing.XS} />
                <Text typography="footnote" fontWeight={'semibold'}>
                  {detail?.createdOn?.format('YYYY-MM-DD hh:mm') ?? '-'}
                </Text>
              </View>
            </View>
            <SizedBox height={Spacing.M} />
            <View style={Styles.row}>
              <View style={Styles.flex}>
                <Text typography="caption2" color={theme.colors.text.secondary}>
                  {translate('payment_total')}
                </Text>
                <SizedBox height={Spacing.XS} />
                <Text
                  typography="footnote"
                  fontWeight={'semibold'}
                  color={theme.colors.primary.default}>
                  {detail.totalDisplay}
                </Text>
              </View>
              <SizedBox width={8} />
              <View style={Styles.flex}>
                <Text typography="caption2" color={theme.colors.text.secondary}>
                  {translate('paid_on')}
                </Text>
                <SizedBox height={Spacing.XS} />
                <Text typography="footnote" fontWeight={'semibold'}>
                  {detail.paidOn?.format('YYYY-MM-DD hh:mm') ?? '-'}
                </Text>
              </View>
            </View>
            <SizedBox height={Spacing.M} />
            <View style={Styles.row}>
              <View style={Styles.flex}>
                <Text typography="caption2" color={theme.colors.text.secondary}>
                  {translate('status')}
                </Text>
                <SizedBox height={Spacing.XS} />
                <Text
                  typography="footnote"
                  fontWeight={'semibold'}
                  color={detail.statusColor}>
                  {detail.status}
                </Text>
              </View>
              <SizedBox width={8} />
              <View style={Styles.flex}>
                <Text typography="caption2" color={theme.colors.text.secondary}>
                  {translate('created_via')}
                </Text>
                <SizedBox height={Spacing.XS} />
                <Text typography="footnote" fontWeight={'semibold'}>
                  {detail.createdVia}
                </Text>
              </View>
            </View>
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
            <View style={Styles.row}>
              <View style={Styles.flex}>
                <Text typography="caption2" color={theme.colors.text.secondary}>
                  {translate('first_name')}
                </Text>
                <SizedBox height={Spacing.XS} />
                <Text typography="footnote" fontWeight={'semibold'}>
                  {detail.billFirstName}
                </Text>
              </View>
              <SizedBox width={8} />
              <View style={Styles.flex}>
                <Text typography="caption2" color={theme.colors.text.secondary}>
                  {translate('last_name')}
                </Text>
                <SizedBox height={Spacing.XS} />
                <Text typography="footnote" fontWeight={'semibold'}>
                  {detail.billLastName}
                </Text>
              </View>
            </View>
            <SizedBox height={Spacing.M} />
            <View style={Styles.row}>
              <View style={Styles.flex}>
                <Text typography="caption2" color={theme.colors.text.secondary}>
                  {translate('phone')}
                </Text>
                <SizedBox height={Spacing.XS} />
                <Text typography="footnote" fontWeight={'semibold'}>
                  {detail.billPhone}
                </Text>
              </View>
              <SizedBox width={8} />
              <View style={Styles.flex}>
                <Text typography="caption2" color={theme.colors.text.secondary}>
                  {translate('email')}
                </Text>
                <SizedBox height={Spacing.XS} />
                <Text typography="footnote" fontWeight={'semibold'}>
                  {detail?.billEmail}
                </Text>
              </View>
            </View>
            <SizedBox height={Spacing.M} />
            <View style={Styles.row}>
              <View style={Styles.flex}>
                <Text typography="caption2" color={theme.colors.text.secondary}>
                  {translate('address')}
                </Text>
                <SizedBox height={Spacing.XS} />
                <Text typography="footnote" fontWeight={'semibold'}>
                  {detail.billAddress || '-'}
                </Text>
              </View>
            </View>
          </View>
        </>
      );
    }
  };

  const buildAction = () => {
    if (detail?.allowCancel || detail?.allowAccept) {
      return (
        <View style={styles.buttonContainer}>
          {detail.allowCancel && (
            <View style={Styles.flex}>
              <Button
                title={translate('cancel')}
                onPress={onCancel}
                type={'outline'}
              />
            </View>
          )}
          {detail.allowAccept && (
            <View style={Styles.flex}>
              <Button title={translate('accept')} onPress={onAccept} />
            </View>
          )}
          {detail.allowPayment && (
            <View style={Styles.flex}>
              <Button title={translate('payment')} onPress={onPayment} />
            </View>
          )}
        </View>
      );
    }
  };

  return (
    <Screen
      navigation={navigation}
      options={{
        title: translate('claim_detail'),
      }}
      scrollable={true}
      footerComponent={buildAction()}
      enableKeyboardAvoidingView={true}
      scrollViewProps={{
        contentContainerStyle: Styles.paddingM,
      }}>
      {renderContent()}
    </Screen>
  );
};

export {ClaimDetail};
