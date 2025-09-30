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
import {bookingActions} from '@redux';
import {BookingModel, BookingResourceModel} from '@models+types';
import styles from './styles';
import QRCode from 'react-native-qrcode-svg';
import moment from 'moment';

const BookingDetail: React.FC<ScreenContainerProps> = ({navigation, item}) => {
  const {theme, translate} = useContext(ApplicationContext);
  const [detail, setDetail] = useState<BookingModel>();

  useEffect(() => {
    bookingActions.onLoadDetail(item, setDetail);
  }, [item]);

  /**
   * on cancel
   */
  const onCancel = () => {
    bookingActions.onCancel(item, setDetail);
  };

  /**
   * on accept
   */
  const onAccept = () => {
    bookingActions.onAccept(item, setDetail);
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
            <View style={Styles.row}>
              <Text typography="subhead" fontWeight="bold">
                {translate('booking_id').toUpperCase()}
              </Text>
              <SizedBox width={Spacing.S} />
              <Text typography="caption1" color={theme.colors.text.secondary}>
                {detail.id}
              </Text>
            </View>
            <SizedBox height={Spacing.M} />
            <View style={Styles.row}>
              <View style={Styles.flex}>
                <Text typography="caption2" color={theme.colors.text.secondary}>
                  {translate('payment')}
                </Text>
                <SizedBox height={Spacing.XS} />
                <Text typography="footnote" fontWeight={'semibold'}>
                  {translate(detail.payment)}
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
                  {detail.transactionID}
                </Text>
              </View>
              <SizedBox width={8} />
              <View style={Styles.flex}>
                <Text typography="caption2" color={theme.colors.text.secondary}>
                  {translate('created_on')}
                </Text>
                <SizedBox height={Spacing.XS} />
                <Text typography="footnote" fontWeight={'semibold'}>
                  {moment(detail?.createdOn)?.format('YYYY-MM-DD hh:mm') ?? '-'}
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
                  {moment(detail.paidOn)?.format('YYYY-MM-DD hh:mm') ?? '-'}
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
            <View style={Styles.rowCenter}>
              <QRCode
                value={`listar://qrcode?type=booking&action=view&id=${detail.id}`}
                size={120}
              />
            </View>
            <SizedBox height={Spacing.M} />
            {detail.resource?.map((i: BookingResourceModel) => {
              return (
                <View key={i.id}>
                  <Text typography="footnote" fontWeight={'semibold'}>
                    {i.name}
                  </Text>
                  <SizedBox height={Spacing.S} />
                  <View style={Styles.rowSpace}>
                    <Text typography="footnote" fontWeight={'semibold'}>
                      {translate('res_length')}
                    </Text>
                    <Text typography="footnote" fontWeight={'semibold'}>
                      x {i.quantity}
                    </Text>
                  </View>
                  <SizedBox height={Spacing.S} />
                  <View style={Styles.rowSpace}>
                    <Text typography="footnote" fontWeight={'semibold'}>
                      {translate('price')}
                    </Text>
                    <Text typography="footnote" fontWeight={'semibold'}>
                      {i.total}
                    </Text>
                  </View>
                </View>
              );
            })}
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
            <Text typography="subhead" fontWeight="bold">
              {translate('billing').toUpperCase()}
            </Text>
            <SizedBox height={Spacing.M} />
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
                  {detail.billAddress}
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
        </View>
      );
    }
  };

  return (
    <Screen
      navigation={navigation}
      options={{
        title: translate('booking_detail'),
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

export {BookingDetail};
