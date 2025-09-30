import React, {useContext} from 'react';
import {
  ApplicationContext,
  Colors,
  Container,
  Icon,
  Item,
  Popup,
  Radius,
  Screen,
  ScreenContainerProps,
  Shadow,
  SizedBox,
  Spacing,
  Styles,
} from '@passionui/components';
import {authenticationActions, userSelect} from '@redux';
import {ListTitle, UserInfo} from '@components';
import {useSelector} from 'react-redux';
import {UserModel} from '@models+types';
import {Linking, Platform, View} from 'react-native';
import styles from './styles';
import {
  BookingManagement,
  ChangePassword,
  ClaimManagement,
  Developer,
  EditProfile,
  Profile,
  Setting,
} from '@screens';

const Account: React.FC<ScreenContainerProps> = ({navigation, options}) => {
  const {theme, navigator, translate} = useContext(ApplicationContext);
  const user = useSelector(userSelect);

  /**
   * on account
   * @param author
   */
  const onProfile = (author: UserModel) => {
    navigator?.push({screen: Profile, author});
  };

  /**
   * on booking management
   */
  const onBookingManagement = () => {
    navigator?.push({screen: BookingManagement});
  };

  /**
   * on claim management
   */
  const onClaimManagement = () => {
    navigator?.push({screen: ClaimManagement});
  };

  /**
   * on edit profile
   */
  const onEditProfile = () => {
    navigator?.push({screen: EditProfile});
  };

  /**
   * on change password
   */
  const onChangePassword = () => {
    navigator?.push({screen: ChangePassword});
  };

  /**
   * on setting
   */
  const onSetting = () => {
    navigator?.push({screen: Setting});
  };

  /**
   * on rate review
   */
  const onStoreReview = () => {
    const STORE_LINK = Platform.select({
      ios: 'items-apps://apps.apple.com/app/id1533609096?action=write-review',
      android: 'market://details?id=com.listarPro',
      default: 'https://demo.listarapp.com/',
    });
    Linking.openURL(STORE_LINK).catch(() => {
      navigator?.showToast({message: translate('error'), type: 'warning'});
    });
  };

  /**
   * on feedback
   */
  const onFeedBack = () => {
    Linking.openURL(
      'mailto:service@passionui.com?subject=[PassionUI][Support]',
    ).catch(() => {
      navigator?.showToast({message: translate('error'), type: 'warning'});
    });
  };

  const onDeveloper = () => {
    navigator?.push({screen: Developer});
  };

  /**
   * on deactivate
   */
  const onDeactivate = () => {
    navigator?.showModal({
      screen: () => (
        <Popup
          title={translate('deactivate')}
          description={translate('would_you_like_deactivate')}
          primary={{
            title: translate('yes'),
            onPress: authenticationActions.onDeactivate,
          }}
          secondary={{
            title: translate('close'),
            onPress: () => {},
          }}
        />
      ),
    });
  };

  /**
   * on logout
   */
  const onLogout = () => {
    navigator?.showModal({
      screen: () => (
        <Popup
          title={translate('sign_out')}
          description={translate('sign_out_confirm')}
          primary={{
            title: translate('yes'),
            onPress: authenticationActions.onLogout,
          }}
          secondary={{
            title: translate('close'),
            onPress: () => {},
          }}
        />
      ),
    });
  };

  return (
    <Screen
      navigation={navigation}
      options={{...options, title: translate('account')}}
      scrollViewProps={{contentContainerStyle: Styles.paddingVerticalM}}
      scrollable={true}>
      <Container
        padding={12}
        style={[
          Shadow.light,
          {
            backgroundColor: theme.colors.background.surface,
            borderRadius: Radius.M,
          },
        ]}>
        <UserInfo
          user={user}
          onPress={onProfile}
          size={'medium'}
          style={Styles.flex}
        />
      </Container>
      <SizedBox height={Spacing.M} />
      <Container
        padding={12}
        style={[
          Shadow.light,
          {
            backgroundColor: theme.colors.background.surface,
            borderRadius: Radius.M,
          },
        ]}>
        <Item widthSpan={12}>
          <ListTitle
            leading={
              <View
                style={[
                  styles.icon,
                  {backgroundColor: Colors.lighten(Colors.blue_04, 32)},
                ]}>
                <Icon name={'calendar'} color={Colors.blue_04} />
              </View>
            }
            title={translate('booking_management')}
            onPress={onBookingManagement}
          />
        </Item>
        <Item widthSpan={12}>
          <ListTitle
            leading={
              <View
                style={[
                  styles.icon,
                  {backgroundColor: Colors.lighten(Colors.green_04, 32)},
                ]}>
                <Icon name={'shield-check-outline'} color={Colors.green_04} />
              </View>
            }
            title={translate('claim_management')}
            onPress={onClaimManagement}
          />
        </Item>
        <Item widthSpan={12}>
          <ListTitle
            leading={
              <View
                style={[
                  styles.icon,
                  {backgroundColor: Colors.lighten(Colors.gold_04, 32)},
                ]}>
                <Icon name={'account-circle-outline'} color={Colors.gold_04} />
              </View>
            }
            title={translate('edit_profile')}
            onPress={onEditProfile}
          />
        </Item>
        <Item widthSpan={12}>
          <ListTitle
            leading={
              <View
                style={[
                  styles.icon,
                  {backgroundColor: Colors.lighten(Colors.violet_04, 32)},
                ]}>
                <Icon name={'lock-outline'} color={Colors.violet_04} />
              </View>
            }
            title={translate('change_password')}
            onPress={onChangePassword}
          />
        </Item>
        <Item widthSpan={12}>
          <ListTitle
            leading={
              <View style={[styles.icon, {backgroundColor: Colors.indigo_08}]}>
                <Icon name={'cog-outline'} color={Colors.indigo_04} />
              </View>
            }
            title={translate('setting')}
            onPress={onSetting}
          />
        </Item>
      </Container>
      <SizedBox height={Spacing.M} />
      <Container
        padding={12}
        style={[
          Shadow.light,
          {
            backgroundColor: theme.colors.background.surface,
            borderRadius: Radius.M,
          },
        ]}>
        <Item widthSpan={12}>
          <ListTitle
            leading={
              <View
                style={[
                  styles.icon,
                  {backgroundColor: Colors.lighten(Colors.gold_04, 32)},
                ]}>
                <Icon name={'star-outline'} color={Colors.gold_04} />
              </View>
            }
            title={translate('rate_for_us')}
            onPress={onStoreReview}
          />
        </Item>
        <Item widthSpan={12}>
          <ListTitle
            leading={
              <View
                style={[
                  styles.icon,
                  {backgroundColor: Colors.lighten(Colors.blue_04, 32)},
                ]}>
                <Icon name={'comment-quote-outline'} color={Colors.blue_04} />
              </View>
            }
            title={translate('help_feedback')}
            onPress={onFeedBack}
          />
        </Item>
      </Container>
      <SizedBox height={Spacing.M} />
      <Container
        padding={12}
        style={[
          Shadow.light,
          {
            backgroundColor: theme.colors.background.surface,
            borderRadius: Radius.M,
          },
        ]}>
        <Item>
          <ListTitle
            leading={
              <View
                style={[
                  styles.icon,
                  {backgroundColor: Colors.lighten(Colors.blue_04, 32)},
                ]}>
                <Icon name={'devices'} color={Colors.blue_04} />
              </View>
            }
            title={translate('developer')}
            onPress={onDeveloper}
          />
        </Item>
      </Container>
      <SizedBox height={Spacing.M} />
      <Container
        padding={12}
        style={[
          Shadow.light,
          {
            backgroundColor: theme.colors.background.surface,
            borderRadius: Radius.M,
          },
        ]}>
        <Item widthSpan={12}>
          <ListTitle
            leading={
              <View
                style={[
                  styles.icon,
                  {backgroundColor: Colors.lighten(Colors.red_04, 32)},
                ]}>
                <Icon name={'account-off-outline'} color={Colors.red_04} />
              </View>
            }
            title={translate('deactivate')}
            onPress={onDeactivate}
          />
        </Item>
        <Item widthSpan={12}>
          <ListTitle
            leading={
              <View
                style={[
                  styles.icon,
                  {backgroundColor: Colors.lighten(Colors.red_04, 32)},
                ]}>
                <Icon name={'logout-variant'} color={Colors.red_04} />
              </View>
            }
            title={translate('sign_out')}
            onPress={onLogout}
          />
        </Item>
      </Container>
    </Screen>
  );
};

export {Account};
