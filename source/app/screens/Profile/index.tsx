import React, {useCallback, useContext, useRef, useState} from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import QRCode from 'react-native-qrcode-svg';
import {
  ApplicationContext,
  Button,
  Colors,
  HeaderRightAction,
  Image,
  NavigationButton,
  Screen,
  ScreenContainerProps,
  SizedBox,
  Spacing,
  Styles,
  TabView,
  TabViewRef,
  Text,
} from '@passionui/components';
import {UserInfo} from '@components';
import {Share, View} from 'react-native';
import {ListingAuthor} from './listing';
import {ReviewAuthor} from './review';
import {FilterModel, ProductModel, UserModel} from '@models+types';
import {Authentication, ProductDetail, SubmitListing} from '@screens';
import {listingActions, reviewActions, settingSelect, userSelect} from '@redux';
import {useSelector} from 'react-redux';
import styles from './styles';

const Profile: React.FC<ScreenContainerProps> = ({navigation, author}) => {
  const {translate, navigator, theme} = useContext(ApplicationContext);
  const [user, setUser] = useState();
  const setting = useSelector(settingSelect);
  const owner = useSelector(userSelect)?.id === author?.id;
  const tabRef = useRef<TabViewRef>();

  /**
   * on load listing
   */
  const onLoadListing = useCallback(
    (filter: FilterModel, params: any, callback: (data: any) => void) => {
      listingActions.onLoadAuthorList(
        filter,
        {...params, userId: author.id},
        result => {
          setUser(result.user);
          callback(result);
        },
      );
    },
    [author.id],
  );

  /**
   * loading author review list
   */
  const onLoadReview = useCallback(
    (params: any, callback: (data: any) => void) => {
      reviewActions.onLoadAuthorReview(
        {...params, userId: author.id},
        result => {
          callback(result);
        },
      );
    },
    [author.id],
  );

  /**
   * on press product
   */
  const onProduct = useCallback(
    (item: ProductModel) => {
      navigator?.push({screen: ProductDetail, item});
    },
    [navigator],
  );

  /**
   * on submit listing
   */
  const onSubmit = () => {
    navigator?.push({
      screen: props => <Authentication {...props} screen={SubmitListing} />,
    });
  };

  /**
   * on share
   */
  const onShare = async (item: UserModel) => {
    try {
      await Share.share({
        title: item.name,
        message: item.url,
      });
    } catch (error: any) {
      navigator?.showToast({message: error.message});
    }
  };

  /**
   * on copy to clipboard
   * @param link
   */
  const onCopy = (link: string) => {
    Clipboard.setString(link);
    navigator?.showToast({
      message: translate('user_link_copied'),
      type: 'success',
    });
  };

  /**
   * on show qrcode
   */
  const onQRCode = () => {
    navigator?.showBottomSheet({
      title: translate('share'),
      snapPoint: 'content',
      backgroundColor: theme.colors.background.surface,
      screen: () => {
        return (
          <View style={Styles.paddingHorizontalM}>
            <View style={Styles.row}>
              <Image
                source={{uri: author?.image}}
                style={styles.userImageShare}
              />
              <SizedBox width={Spacing.S} />
              <View style={Styles.flex}>
                <Text typography="headline" fontWeight="bold">
                  {author.name}
                </Text>
                <Text typography="caption1">
                  {translate('share_qr_profile')}
                </Text>
              </View>
            </View>
            <SizedBox height={Spacing.M} />
            <View style={Styles.row}>
              <QRCode
                value={`listar://qrcode?type=profile&action=view&id=${author.id}`}
                size={160}
                logo={{uri: author?.image}}
                logoSize={24}
                logoBackgroundColor={Colors.white}
              />
              <SizedBox width={Spacing.M} />
              <View style={Styles.flex}>
                <Button
                  size="medium"
                  type="outline"
                  onPress={() => {
                    navigator?.pop();
                    onShare(author).then();
                  }}
                  title={translate('share')}
                />
                <SizedBox height={16} />
                <Button
                  size="medium"
                  onPress={() => {
                    navigator?.pop();
                    onCopy(author.link);
                  }}
                  title={translate('copy')}
                />
              </View>
            </View>
          </View>
        );
      },
    });
  };

  let headerRight = (props: any) => <View {...props} />;
  let tabs = [
    {
      label: translate('listing'),
      content: (
        <ListingAuthor
          key="listing"
          onProduct={onProduct}
          onLoadListing={onLoadListing}
          owner={owner}
          pending={false}
        />
      ),
    },
    {
      label: translate('review'),
      content: <ReviewAuthor key="review" onLoadReview={onLoadReview} />,
    },
  ];

  /**
   * build for only owner
   */
  if (owner) {
    if (setting?.enableSubmit) {
      headerRight = (props: any) => (
        <HeaderRightAction {...props}>
          <NavigationButton icon={'plus'} onPress={onSubmit} />
        </HeaderRightAction>
      );
    }
    tabs = [
      {
        label: translate('listing'),
        content: (
          <ListingAuthor
            key="listing"
            onProduct={onProduct}
            onLoadListing={onLoadListing}
            owner={owner}
            pending={false}
          />
        ),
      },
      {
        label: translate('pending'),
        content: (
          <ListingAuthor
            key="pending"
            onProduct={onProduct}
            onLoadListing={onLoadListing}
            owner={owner}
            pending={true}
          />
        ),
      },
      {
        label: translate('review'),
        content: <ReviewAuthor key="review" onLoadReview={onLoadReview} />,
      },
    ];
  }

  return (
    <Screen
      navigation={navigation}
      options={{
        title: translate('profile'),
        headerRight,
      }}>
      <View style={Styles.paddingM}>
        <UserInfo
          user={user}
          onQRCode={onQRCode}
          size={'large'}
          onPress={onQRCode}
        />
      </View>
      <View style={Styles.flex}>
        <TabView
          ref={tabRef}
          tabs={tabs}
          direction={'row'}
          style={Styles.flex}
          initialIndex={0}
        />
      </View>
    </Screen>
  );
};

export {Profile};
