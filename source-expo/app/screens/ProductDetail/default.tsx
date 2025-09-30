import React, {useContext, useEffect, useState} from 'react';
import {
  ApplicationContext,
  Button,
  Divider,
  HeaderBanner,
  HeaderRightAction,
  Icon,
  IconButton,
  Image,
  NavigationButton,
  Screen,
  ScreenContainerProps,
  SizedBox,
  Skeleton,
  Spacing,
  Styles,
  Tag,
  Text,
} from '@passionui/components';
import {ProductModel, UserModel} from '@models+types';
import {
  FlatList,
  Linking,
  Share,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import styles from './styles';

import {
  DownloadFile,
  ListTitle,
  ProductItem,
  ProductViewType,
  Rating,
  SpaceList,
  UserInfo,
  VideoPlayer,
} from '@components';
import {
  Authentication,
  Booking,
  Gallery,
  Location,
  ProductDetail,
  Profile,
  Review,
} from '@screens';
import {convertIcon, enableExperimental} from '@utils';
import {Circle} from 'react-native-progress';
import Assets from '@assets';
import {listingActions, userSelect, wishlistActions} from '@redux';
import {useSelector} from 'react-redux';
import moment from 'moment';

const ProductDetailDefault: React.FC<ScreenContainerProps> = ({
  navigation,
  ...params
}) => {
  const {theme, navigator, translate} = useContext(ApplicationContext);
  const dimensions = useWindowDimensions();
  const authenticated = useSelector(userSelect);
  const [product, setProduct] = useState<ProductModel>();
  const [showSocials, setShowSocials] = useState(true);
  const [showAttachments, setShowAttachments] = useState(true);

  useEffect(() => {
    listingActions.onDetail(params.item, setProduct);
  }, [params.item]);

  /**
   * on info action
   */
  const onAction = (url: string) => {
    Linking.openURL(url).catch(e => {
      navigator?.showToast({message: e.message, type: 'warning'});
    });
  };

  /**
   * On share
   */
  const onShare = async () => {
    try {
      await Share.share({
        title: product!.title,
        url: product!.link,
      });
    } catch (e: any) {
      navigator?.showToast({message: e.message, type: 'warning'});
    }
  };

  /**
   * On location
   */
  const onLocation = () => {
    navigator?.push({screen: Location, item: product?.gps});
  };

  /**
   * On Gallery
   */
  const onGalleries = () => {
    navigator?.push({screen: Gallery, item: product});
  };

  /**
   * on account
   * @param author
   */
  const onProfile = (author: UserModel) => {
    navigator?.push({screen: Profile, author});
  };

  /**
   * on review
   */
  const onReview = () => {
    navigator?.push({
      screen: Review,
      item: product,
      reload: () => {
        listingActions.onDetail(params.item, setProduct);
      },
    });
  };

  /**
   * On favorite
   */
  const onFavorite = () => {
    const ecx = product?.favorite
      ? wishlistActions.onDeleted
      : wishlistActions.onAdd;

    if (authenticated) {
      ecx(product!, () => {
        listingActions.onDetail(params.item, setProduct);
      });
    } else {
      navigator?.push({
        screen: props => <Authentication {...props} />,
        onLogin: () => {
          ecx(product!, () => {
            listingActions.onDetail(params.item, setProduct);
          });
        },
      });
    }
  };

  /**
   * On booking
   */
  const onBooking = () => {
    navigator?.push({
      screen: props => <Authentication {...props} screen={Booking} />,
      item: product,
    });
  };

  /**
   * on press product
   */
  const onProduct = (item: ProductModel) => {
    navigator?.push({screen: ProductDetail, item});
  };

  /**
   * On address
   */
  const onAddress = () => {
    navigator?.showBottomSheet({
      title: translate('address'),
      snapPoint: 'content',
      screen: () => {
        return (
          <View style={Styles.paddingHorizontalM}>
            <ListTitle
              title="Apple Maps"
              leading={<Icon name="apple" />}
              onPress={() =>
                onAction(
                  `http://maps.apple.com/maps?saddr=${product?.gps?.latitude},${product?.gps?.longitude}`,
                )
              }
            />
            <Divider style={{marginVertical: Spacing.XS}} />
            <ListTitle
              title="Google Maps"
              leading={<Icon name="google" />}
              onPress={() =>
                onAction(
                  `https://www.google.com/maps/search/?api=1&query=${product?.gps?.latitude},${product?.gps?.longitude}`,
                )
              }
            />
          </View>
        );
      },
    });
  };

  /**
   * On address
   */
  const onPhone = () => {
    navigator?.showBottomSheet({
      title: translate('phone'),
      snapPoint: 'content',
      screen: () => {
        return (
          <View style={Styles.paddingHorizontalM}>
            <ListTitle
              title="WhatsApp"
              leading={
                <Image source={Assets.image.whatsapp} style={styles.iconInfo} />
              }
              onPress={() =>
                onAction(`whatsapp://send?phone=${product?.phone}`)
              }
            />
            <Divider style={{marginVertical: Spacing.XS}} />
            <ListTitle
              title="Viber"
              leading={
                <Image source={Assets.image.viber} style={styles.iconInfo} />
              }
              onPress={() =>
                onAction(
                  `viber://contact?number=${encodeURIComponent(
                    product?.phone ?? '',
                  )}`,
                )
              }
            />
            <Divider style={{marginVertical: Spacing.XS}} />
            <ListTitle
              title="Telegram"
              leading={
                <Image source={Assets.image.telegram} style={styles.iconInfo} />
              }
              onPress={() => onAction(`tg://resolve?phone=${product?.phone}`)}
            />
          </View>
        );
      },
    });
  };

  /**
   * Build action for header right
   * @param props
   */
  const headerRight = (props: any) => {
    if (product) {
      return (
        <HeaderRightAction {...props}>
          <NavigationButton icon={'share-outline'} onPress={onShare} />
          {product.gps && (
            <NavigationButton icon={'map-outline'} onPress={onLocation} />
          )}
          {product.galleries.length > 0 && (
            <NavigationButton icon={'image-outline'} onPress={onGalleries} />
          )}
        </HeaderRightAction>
      );
    }
  };

  /**
   * Build banner for header
   * @param props
   */
  const buildBanner = (props: any) => {
    if (product) {
      return (
        <HeaderBanner {...props}>
          <Image
            source={{uri: product?.image?.full}}
            style={Styles.flex}
            resizeMode={'cover'}
          />
          {product.videoURL && (
            <VideoPlayer url={product.videoURL} style={styles.video} />
          )}
        </HeaderBanner>
      );
    }
    return <Skeleton />;
  };

  /**
   * Build footer action
   */
  const buildFooter = () => {
    if (product && product?.priceDisplay?.length > 0) {
      return (
        <View style={styles.footer}>
          <View>
            <Text typography={'caption1'} color={theme.colors.text.secondary}>
              {translate('total_price')}
            </Text>
            <SizedBox height={Spacing.XS} />
            <Text typography={'headline'} fontWeight={'bold'}>
              {product.priceDisplay}
            </Text>
          </View>
          <Button
            title={translate('book_now')}
            full={false}
            onPress={onBooking}
          />
        </View>
      );
    }
  };

  const buildContent = () => {
    let title = (
      <SizedBox height={16} width={150}>
        <Skeleton />
      </SizedBox>
    );
    let status = <View />;
    let favorite = (
      <View style={Styles.paddingM}>
        <SizedBox height={24} width={24}>
          <Skeleton />
        </SizedBox>
      </View>
    );
    let category = (
      <SizedBox height={14} width={80}>
        <Skeleton />
      </SizedBox>
    );
    let rate = (
      <View style={Styles.row}>
        <SizedBox height={20} width={40}>
          <Skeleton />
        </SizedBox>
        <SizedBox width={Spacing.XS} />
        <SizedBox height={20} width={80}>
          <Skeleton />
        </SizedBox>
      </View>
    );
    let address = (
      <>
        <SizedBox height={Spacing.M} />
        <View style={Styles.row}>
          <Skeleton style={styles.iconInfo} />
          <SizedBox width={Spacing.S} />
          <View style={Styles.flex}>
            <SizedBox height={10} width={80}>
              <Skeleton />
            </SizedBox>
            <SizedBox height={Spacing.XS} />
            <SizedBox height={10} width={150}>
              <Skeleton />
            </SizedBox>
          </View>
        </View>
      </>
    );
    let phone = address;
    let email = address;
    let website = address;
    let attachments = <View />;
    let socials = <View />;
    let description = (
      <>
        <Skeleton style={styles.line} />
        <SizedBox height={Spacing.S} />
        <Skeleton style={styles.line} />
        <SizedBox height={Spacing.S} />
        <Skeleton style={styles.line} />
        <SizedBox height={Spacing.S} />
        <Skeleton style={styles.line} />
        <SizedBox height={Spacing.S} />
        <Skeleton style={styles.line} />
        <SizedBox height={Spacing.S} />
        <Skeleton style={styles.line} />
        <SizedBox height={Spacing.S} />
        <Skeleton style={styles.line} />
      </>
    );
    let dateEstablish = <View />;
    let price = <View />;
    let feature = <View />;
    let latest = <View />;
    let related = <View />;

    if (product) {
      if (product.status) {
        status = (
          <Tag
            label={product.status}
            color={theme.colors.primary.default}
            size={'medium'}
          />
        );
      }

      title = (
        <Text
          typography="headline"
          fontWeight="bold"
          numberOfLines={2}
          style={Styles.flex}>
          {product?.title}
        </Text>
      );

      favorite = (
        <IconButton
          type="secondary"
          size={'large'}
          onPress={onFavorite}
          icon={product?.favorite ? 'heart' : 'heart-outline'}
          color={theme.colors.primary.default}
        />
      );

      category = (
        <Text
          typography="caption1"
          fontWeight={'semibold'}
          color={theme.colors.secondary.default}>
          {product?.category?.title}
        </Text>
      );

      rate = (
        <TouchableOpacity style={Styles.row} onPress={onReview}>
          <Tag label={`${product?.rate}`} type={'rating'} />
          <SizedBox width={Spacing.XS} />
          <Rating rate={product?.rate} disabled={true} />
          <SizedBox width={Spacing.XS} />
          <Text typography={'footnote'}>({product.numRate})</Text>
        </TouchableOpacity>
      );

      if (product.address && product.address.trim() !== '') {
        address = (
          <>
            <SizedBox height={Spacing.M} />
            <TouchableOpacity style={Styles.row} onPress={onAddress}>
              <View
                style={[
                  styles.iconInfo,
                  {backgroundColor: theme.colors.background.disable},
                ]}>
                <Icon name={'map-marker-outline'} size={18} />
              </View>
              <SizedBox width={Spacing.S} />
              <View style={Styles.flex}>
                <Text
                  typography={'caption2'}
                  color={theme.colors.text.secondary}>
                  {translate('location')}
                </Text>
                <SizedBox height={Spacing.XXS} />
                <Text typography={'caption1'} fontWeight={'bold'}>
                  {product.address}
                </Text>
              </View>
            </TouchableOpacity>
          </>
        );
      }

      if (product.phone) {
        phone = (
          <>
            <SizedBox height={Spacing.M} />
            <TouchableOpacity style={Styles.row} onPress={onPhone}>
              <View
                style={[
                  styles.iconInfo,
                  {backgroundColor: theme.colors.background.disable},
                ]}>
                <Icon name={'phone-outline'} size={18} />
              </View>
              <SizedBox width={Spacing.S} />
              <View style={Styles.flex}>
                <Text
                  typography={'caption2'}
                  color={theme.colors.text.secondary}>
                  {translate('phone')}
                </Text>
                <SizedBox height={Spacing.XXS} />
                <Text typography={'caption1'} fontWeight={'bold'}>
                  {product.phone}
                </Text>
              </View>
            </TouchableOpacity>
          </>
        );
      }

      if (product.email) {
        email = (
          <>
            <SizedBox height={Spacing.M} />
            <TouchableOpacity
              style={Styles.row}
              onPress={() => onAction(`mailto:${product?.email}`)}>
              <View
                style={[
                  styles.iconInfo,
                  {backgroundColor: theme.colors.background.disable},
                ]}>
                <Icon name={'email-outline'} size={18} />
              </View>
              <SizedBox width={Spacing.S} />
              <View style={Styles.flex}>
                <Text
                  typography={'caption2'}
                  color={theme.colors.text.secondary}>
                  {translate('email')}
                </Text>
                <SizedBox height={Spacing.XXS} />
                <Text typography={'caption1'} fontWeight={'bold'}>
                  {product.email}
                </Text>
              </View>
            </TouchableOpacity>
          </>
        );
      }

      if (product.website && product.website.trim() !== '') {
        website = (
          <>
            <SizedBox height={Spacing.M} />
            <TouchableOpacity
              style={Styles.row}
              onPress={() => onAction(product?.website)}>
              <View
                style={[
                  styles.iconInfo,
                  {backgroundColor: theme.colors.background.disable},
                ]}>
                <Icon name={'web'} size={18} />
              </View>
              <SizedBox width={Spacing.S} />
              <View style={Styles.flex}>
                <Text
                  typography={'caption2'}
                  color={theme.colors.text.secondary}>
                  {translate('website')}
                </Text>
                <SizedBox height={Spacing.XXS} />
                <Text typography={'caption1'} fontWeight={'bold'}>
                  {product.website}
                </Text>
              </View>
            </TouchableOpacity>
          </>
        );
      }

      if (product.attachments) {
        attachments = (
          <>
            <SizedBox height={Spacing.M} />
            <TouchableOpacity
              style={Styles.row}
              onPress={() => {
                enableExperimental();
                setShowAttachments(!showAttachments);
              }}>
              <View
                style={[
                  styles.iconInfo,
                  {backgroundColor: theme.colors.background.disable},
                ]}>
                <Icon name={'file-cloud-outline'} size={18} />
              </View>
              <SizedBox width={Spacing.S} />
              <View style={Styles.flex}>
                <Text
                  typography={'caption2'}
                  color={theme.colors.text.secondary}>
                  {translate('attachments')}
                </Text>
                <SizedBox height={Spacing.XXS} />
                <Text typography={'caption1'} fontWeight={'bold'}>
                  {product.attachments.length} {translate('files')}
                </Text>
              </View>
              <Icon name={showAttachments ? 'chevron-up' : 'chevron-down'} />
            </TouchableOpacity>
            {showAttachments && (
              <FlatList
                scrollEnabled={false}
                ItemSeparatorComponent={Divider}
                data={product?.attachments}
                renderItem={({item}) => {
                  return (
                    <View style={styles.subInfo}>
                      <Text typography="caption2">{item.name}</Text>
                      <DownloadFile onCompleted={() => {}} link={item.url}>
                        {({percent, uri, download, open}: any) => {
                          const icon = uri ? 'check' : 'download';
                          let trailing = (
                            <Icon
                              name={icon}
                              size={16}
                              color={theme.colors.secondary.default}
                            />
                          );
                          if (!uri && percent > 0 && percent < 100) {
                            trailing = (
                              <Circle
                                progress={percent / 100}
                                color={theme.colors.secondary.default}
                                thickness={2}
                                size={16}
                              />
                            );
                          }
                          return (
                            <TouchableOpacity
                              onPress={uri ? open : download}
                              style={Styles.row}>
                              <Text
                                typography="footnote"
                                fontWeight="bold"
                                color={theme.colors.secondary.default}>
                                {item.size}
                              </Text>
                              <SizedBox width={8} />
                              {trailing}
                            </TouchableOpacity>
                          );
                        }}
                      </DownloadFile>
                    </View>
                  );
                }}
                keyExtractor={(item, index) => `file${item?.url ?? index}`}
                style={styles.subInfoContent}
              />
            )}
          </>
        );
      }

      if (Object.entries(product.socials ?? {}).length > 0) {
        socials = (
          <>
            <SizedBox height={Spacing.M} />
            <TouchableOpacity
              style={Styles.row}
              onPress={() => {
                enableExperimental();
                setShowSocials(!showSocials);
              }}>
              <View
                style={[
                  styles.iconInfo,
                  {backgroundColor: theme.colors.background.disable},
                ]}>
                <Icon name={'link'} size={18} />
              </View>
              <SizedBox width={Spacing.S} />
              <Text
                typography={'caption2'}
                color={theme.colors.text.secondary}
                style={Styles.flex}>
                {translate('social_network')}
              </Text>
              <Icon name={showSocials ? 'chevron-up' : 'chevron-down'} />
            </TouchableOpacity>
            <View style={styles.socialContent}>
              {showSocials &&
                Object.entries(product.socials).map(([key, value]) => {
                  const images: any = Assets.image;
                  return (
                    <TouchableOpacity
                      key={key}
                      style={styles.socialItem}
                      onPress={() => onAction(value)}>
                      <Image style={Styles.flex} source={images[key]} />
                    </TouchableOpacity>
                  );
                })}
            </View>
          </>
        );
      }

      description = <Text typography={'subhead'}>{product.description}</Text>;

      if (product.dateEstablish) {
        dateEstablish = (
          <View>
            <Text typography="caption1" color={theme.colors.text.secondary}>
              {translate('date_established')}
            </Text>
            <SizedBox height={Spacing.XS} />
            <Text typography="subhead" fontWeight={'bold'}>
              {moment(product.dateEstablish).format('MMMM D, YYYY')}
            </Text>
          </View>
        );
      }

      if (product.priceMin || product.priceMax || product.priceDisplay) {
        const displayPrice =
          product.priceDisplay || product.priceMin || product.priceMax;
        if (displayPrice) {
          price = (
            <View>
              <Text typography="caption1" color={theme.colors.text.secondary}>
                {translate('price')}
              </Text>
              <SizedBox height={Spacing.XS} />
              <Text typography="subhead" fontWeight={'bold'}>
                {displayPrice}
              </Text>
            </View>
          );
        }
      }

      if (product.features?.length > 0) {
        feature = (
          <>
            <SizedBox height={Spacing.M} />
            <Divider />
            <SizedBox height={Spacing.M} />
            <Text typography="headline" fontWeight="bold">
              {translate('featured')}
            </Text>
            <SizedBox height={Spacing.S} />
            <View style={styles.featureContent}>
              {product.features.map(item => {
                return (
                  <Tag
                    key={item.id}
                    label={item.title}
                    size={'medium'}
                    color={theme.colors.secondary.default}
                    icon={convertIcon(item.icon!)}
                  />
                );
              })}
            </View>
          </>
        );
      }

      if (product.latest?.length > 0) {
        latest = (
          <>
            <SizedBox height={Spacing.M} />
            <Text
              typography="headline"
              fontWeight="bold"
              style={Styles.paddingHorizontalM}>
              {translate('latest')}
            </Text>
            <SizedBox height={Spacing.S} />
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={product.latest}
              renderItem={({item}) => (
                <ProductItem
                  item={item}
                  onPress={onProduct}
                  type={ProductViewType.grid}
                  style={{width: dimensions.width / 2}}
                />
              )}
              contentContainerStyle={Styles.paddingHorizontalM}
              keyExtractor={(item, index) => `related${item?.id ?? index}`}
              ItemSeparatorComponent={SpaceList}
            />
          </>
        );
      }

      if (product.related?.length > 0) {
        related = (
          <>
            <SizedBox height={Spacing.M} />
            <Text typography="headline" fontWeight="bold">
              {translate('related')}
            </Text>
            <SizedBox height={Spacing.S} />
            <FlatList
              scrollEnabled={false}
              data={product.related}
              renderItem={({item}) => (
                <ProductItem
                  item={item}
                  onPress={onProduct}
                  type={ProductViewType.small}
                />
              )}
              keyExtractor={(item, index) => `related${item?.id ?? index}`}
              ItemSeparatorComponent={SpaceList}
            />
          </>
        );
      }
    }

    return (
      <>
        <View
          style={[
            Styles.paddingM,
            {backgroundColor: theme.colors.background.default},
          ]}>
          <View style={Styles.rowSpace}>
            <UserInfo
              user={product?.author}
              onPress={onProfile}
              style={Styles.flex}
            />
            {status}
          </View>
          <View style={Styles.rowSpace}>
            {title}
            {favorite}
          </View>
          <View style={Styles.rowSpace}>
            <View>
              {category}
              <SizedBox height={Spacing.XS} />
              {rate}
            </View>
          </View>
          {address}
          {phone}
          {email}
          {website}
          {attachments}
          {socials}
          <SizedBox height={Spacing.M} />
          {description}
          <SizedBox height={Spacing.M} />
          <View style={Styles.rowSpace}>
            {dateEstablish}
            {price}
          </View>
          {feature}
        </View>
        {latest}
        <View style={Styles.paddingHorizontalM}>{related}</View>
      </>
    );
  };

  return (
    <Screen
      navigation={navigation}
      options={{title: '', headerRight}}
      scrollable={true}
      animatedHeader={{
        type: 'surface',
        component: buildBanner,
      }}
      footerComponent={buildFooter()}>
      {buildContent()}
    </Screen>
  );
};

export {ProductDetailDefault};
