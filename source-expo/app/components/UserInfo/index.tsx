import React, {useContext} from 'react';
import {
  ApplicationContext,
  Colors,
  Icon,
  IconButton,
  Image,
  SizedBox,
  Skeleton,
  Spacing,
  Styles,
  Text,
} from '@passionui/components';
import {StyleProp, TouchableOpacity, View, ViewStyle} from 'react-native';
import styles from './styles';
import {UserModel} from '@models+types';
import {Rating} from '@components';

type UserInfoProps = {
  user?: UserModel;
  size?: 'small' | 'large' | 'medium';
  onPress?: (user: UserModel) => void;
  onQRCode?: () => void;
  style?: StyleProp<ViewStyle>;
};

const UserInfo: React.FC<UserInfoProps> = ({
  user,
  onPress,
  onQRCode,
  size = 'small',
  style,
}) => {
  const {theme} = useContext(ApplicationContext);
  /**
   * Render small user info
   */
  const renderSmall = () => {
    if (user) {
      return (
        <TouchableOpacity
          style={[Styles.row, style]}
          onPress={() => onPress?.(user)}>
          <Image source={{uri: user.image}} style={styles.small} />
          <SizedBox width={Spacing.S} />
          <View style={[Styles.flex]}>
            <Text typography={'footnote'} fontWeight={'bold'}>
              {user.name}
            </Text>
            <SizedBox height={Spacing.XXS} />
            <Text typography={'caption2'}>{user.email}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <View style={[Styles.row, style]}>
        <Skeleton style={styles.small} />
        <SizedBox width={Spacing.S} />
        <View style={Styles.flex}>
          <SizedBox width={100} height={10}>
            <Skeleton />
          </SizedBox>
          <SizedBox height={Spacing.XXS} />
          <SizedBox width={150} height={10}>
            <Skeleton />
          </SizedBox>
        </View>
      </View>
    );
  };

  /**
   * Render medium user info
   */
  const renderMedium = () => {
    if (user) {
      return (
        <TouchableOpacity
          style={[Styles.row, style]}
          onPress={() => onPress?.(user)}>
          <Image source={{uri: user.image}} style={styles.medium} />
          <SizedBox width={Spacing.S} />
          <View style={Styles.flex}>
            <Text typography={'callout'} fontWeight={'bold'}>
              {user.name}
            </Text>
            {user.description && (
              <>
                <SizedBox height={Spacing.XXS} />
                <Text typography={'caption1'}>{user.description}</Text>
              </>
            )}
            <SizedBox height={Spacing.XXS} />
            <Text typography={'caption2'}>{user.email}</Text>
          </View>
          <Icon name={'chevron-right'} />
        </TouchableOpacity>
      );
    }

    return (
      <View style={[Styles.row, style]}>
        <Skeleton style={styles.medium} />
        <SizedBox width={Spacing.S} />
        <View style={Styles.flex}>
          <SizedBox width={100} height={10}>
            <Skeleton />
          </SizedBox>
          <SizedBox height={Spacing.XXS} />
          <SizedBox width={150} height={10}>
            <Skeleton />
          </SizedBox>
        </View>
        <Icon name={'chevron-right'} />
      </View>
    );
  };

  /**
   * Render large user info
   */
  const renderLarge = () => {
    if (user) {
      return (
        <TouchableOpacity
          style={[Styles.row, style]}
          onPress={() => onPress?.(user)}>
          <View>
            <Image source={{uri: user.image}} style={styles.large} />
            <View
              style={[
                styles.badge,
                {backgroundColor: theme.colors.primary.default},
              ]}>
              <Text
                typography={'caption2'}
                fontWeight={'bold'}
                color={Colors.white}>
                {user?.rate?.toFixed(1)}
              </Text>
            </View>
          </View>
          <SizedBox width={Spacing.S} />
          <View style={[Styles.columnCenterLeft, Styles.flex]}>
            <Text typography={'callout'} fontWeight={'bold'}>
              {user.name}
            </Text>
            {user.rate > 0 && (
              <>
                <SizedBox height={Spacing.XS} />
                <Rating rate={user.rate} />
              </>
            )}
            {user.description && (
              <>
                <SizedBox height={Spacing.XS} />
                <Text typography={'caption1'}>{user.description}</Text>
              </>
            )}
            <SizedBox height={Spacing.XS} />
            <Text typography={'caption2'}>{user.email}</Text>
          </View>
          <IconButton
            icon={'qrcode-plus'}
            type={'secondary'}
            size={'large'}
            onPress={onQRCode}
          />
        </TouchableOpacity>
      );
    }

    return (
      <View style={[Styles.row, style]}>
        <Skeleton style={styles.large} />
        <SizedBox width={Spacing.S} />
        <View style={Styles.flex}>
          <SizedBox width={100} height={12}>
            <Skeleton />
          </SizedBox>
          <SizedBox height={Spacing.S} />
          <SizedBox width={150} height={12}>
            <Skeleton />
          </SizedBox>
          <SizedBox height={Spacing.S} />
          <SizedBox width={180} height={12}>
            <Skeleton />
          </SizedBox>
        </View>
        <SizedBox width={28} height={28}>
          <Skeleton />
        </SizedBox>
        <SizedBox width={Spacing.M} />
      </View>
    );
  };

  switch (size) {
    case 'small':
      return renderSmall();
    case 'medium':
      return renderMedium();
    case 'large':
      return renderLarge();
    default:
      return renderSmall();
  }
};

export {UserInfo};
