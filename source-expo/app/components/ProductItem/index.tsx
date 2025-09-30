import React, {useContext} from 'react';
import {Pressable, StyleProp, View, ViewStyle} from 'react-native';
import styles from './styles';
import {ProductModel} from '@models+types';
import {
  ApplicationContext,
  Colors,
  Icon,
  Image,
  SizedBox,
  Skeleton,
  Spacing,
  Styles,
  Tag,
  Text,
} from '@passionui/components';
import {Rating} from '@components';

export enum ProductViewType {
  small = 'small',
  grid = 'grid',
  list = 'list',
  block = 'block',
  card = 'card',
  cardFull = 'card-full',
}

export type ProductItemProps = {
  style?: StyleProp<ViewStyle>;
  item?: ProductModel;
  onPress: (item: ProductModel) => void;
  type: ProductViewType;
};

const ProductItem: React.FC<ProductItemProps> = ({
  style,
  item,
  onPress,
  type,
}) => {
  const {theme, translate} = useContext(ApplicationContext);

  /**
   * render small style
   * @returns {JSX.Element}
   */
  const renderSmall = (): JSX.Element => {
    if (item?.id) {
      return (
        <View style={Styles.row}>
          <Image
            style={styles.smallImage}
            source={{uri: item.image?.full}}
            resizeMode="cover"
          />
          <SizedBox width={8} />
          <View style={Styles.flex}>
            <Text typography="subhead" fontWeight="bold" numberOfLines={1}>
              {item.title}
            </Text>
            <SizedBox height={Spacing.XXS} />
            <Text typography="caption1" color={theme.colors.text.secondary}>
              {item.category?.title}
            </Text>
            <SizedBox height={Spacing.XS} />
            <View style={Styles.row}>
              <Tag
                label={`${item.rate}`}
                color={theme.colors.primary.default}
                type={'rating'}
              />
              <SizedBox width={Spacing.XS} />
              <Rating rate={item.rate} />
            </View>
            {item.priceDisplay && (
              <>
                <SizedBox height={Spacing.XS} />
                <Text
                  typography="subhead"
                  fontWeight="bold"
                  color={theme.colors.primary.default}>
                  {item.priceDisplay}
                </Text>
              </>
            )}
          </View>
        </View>
      );
    }

    return (
      <View style={Styles.row}>
        <Skeleton style={styles.smallImage} />
        <SizedBox width={Spacing.S} />
        <View style={Styles.columnCenterLeft}>
          <SizedBox height={10} width={100}>
            <Skeleton />
          </SizedBox>
          <SizedBox height={Spacing.S} />
          <SizedBox height={16} width={120}>
            <Skeleton />
          </SizedBox>
          <SizedBox height={Spacing.S} />
          <SizedBox height={10} width={150}>
            <Skeleton />
          </SizedBox>
        </View>
      </View>
    );
  };

  /**
   * render list style
   * @returns {JSX.Element}
   */
  const renderList = (): JSX.Element => {
    if (item?.id) {
      return (
        <View style={Styles.row}>
          <Image
            style={styles.listImage}
            source={{uri: item.image?.full}}
            resizeMode="cover">
            {item.status && (
              <View style={[Styles.row, Styles.paddingS]}>
                <View
                  style={[
                    styles.status,
                    {backgroundColor: theme.colors.primary.default},
                  ]}>
                  <Text
                    typography={'caption1'}
                    fontWeight={'bold'}
                    color={Colors.white}>
                    {item.status}
                  </Text>
                </View>
              </View>
            )}
          </Image>
          <SizedBox width={8} />
          <View style={Styles.flex}>
            <Text typography="caption1" color={theme.colors.text.secondary}>
              {item.category?.title}
            </Text>
            <SizedBox height={Spacing.XXS} />
            <Text typography="subhead" fontWeight="bold" numberOfLines={1}>
              {item.title}
            </Text>
            <SizedBox height={Spacing.XS} />
            <View style={Styles.row}>
              <Tag
                label={`${item.rate}`}
                color={theme.colors.primary.default}
                type={'rating'}
              />
              <SizedBox width={Spacing.XS} />
              <Rating rate={item.rate} />
            </View>
            <SizedBox height={Spacing.XXS} />
            {item.address && (
              <>
                <SizedBox height={Spacing.XS} />
                <View style={Styles.row}>
                  <Icon
                    name={'map-marker-outline'}
                    size={14}
                    color={theme.colors.primary.default}
                  />
                  <SizedBox width={Spacing.XS} />
                  <Text
                    typography="caption1"
                    numberOfLines={1}
                    style={Styles.flex}>
                    {item.address}
                  </Text>
                </View>
              </>
            )}
            {item.phone && (
              <>
                <SizedBox height={Spacing.XS} />
                <View style={Styles.row}>
                  <Icon
                    name={'phone-outline'}
                    size={14}
                    color={theme.colors.primary.default}
                  />
                  <SizedBox width={Spacing.XS} />
                  <Text typography="caption1">{item.phone}</Text>
                </View>
              </>
            )}
            {item.priceDisplay && (
              <>
                <SizedBox height={Spacing.XS} />
                <Text
                  typography="subhead"
                  fontWeight="bold"
                  color={theme.colors.primary.default}>
                  {item.priceDisplay}
                </Text>
              </>
            )}
          </View>
          <Icon
            name={item.favorite ? 'heart' : 'heart-outline'}
            color={theme.colors.primary.default}
            style={styles.favorite}
          />
        </View>
      );
    }

    return (
      <View style={Styles.row}>
        <Skeleton style={styles.listImage} />
        <SizedBox width={8} />
        <View style={Styles.flex}>
          <SizedBox height={10} width={100}>
            <Skeleton />
          </SizedBox>
          <SizedBox height={Spacing.S} />
          <SizedBox height={10} width={150}>
            <Skeleton />
          </SizedBox>
          <SizedBox height={Spacing.S} />
          <View style={Styles.row}>
            <SizedBox height={24} width={60}>
              <Skeleton />
            </SizedBox>
          </View>
          <SizedBox height={Spacing.S} />
          <SizedBox height={10} width={100}>
            <Skeleton />
          </SizedBox>
          <SizedBox height={Spacing.S} />
          <SizedBox height={10} width={100}>
            <Skeleton />
          </SizedBox>
        </View>
      </View>
    );
  };

  /**
   * render grid style
   * @returns {JSX.Element}
   */
  const renderGrid = (): JSX.Element => {
    if (item?.id) {
      return (
        <>
          <Image
            style={styles.gridImage}
            source={{uri: item.image?.full}}
            resizeMode="cover">
            {item.status && (
              <View style={[Styles.row, Styles.paddingS]}>
                <View
                  style={[
                    styles.status,
                    {backgroundColor: theme.colors.primary.default},
                  ]}>
                  <Text
                    typography={'caption1'}
                    fontWeight={'bold'}
                    color={Colors.white}>
                    {item.status}
                  </Text>
                </View>
              </View>
            )}
            <View style={styles.gridFavorite}>
              <Icon
                name={item.favorite ? 'heart' : 'heart-outline'}
                color={Colors.white}
              />
            </View>
          </Image>
          <SizedBox height={Spacing.S} />
          <Text typography="caption1" color={theme.colors.text.secondary}>
            {item.category?.title}
          </Text>
          <SizedBox height={Spacing.XXS} />
          <Text typography="subhead" fontWeight="bold" numberOfLines={1}>
            {item.title}
          </Text>
          <SizedBox height={Spacing.S} />
          <View style={Styles.rowSpace}>
            <View style={Styles.row}>
              <Tag
                label={`${item.rate}`}
                color={theme.colors.primary.default}
                type={'rating'}
              />
              <SizedBox width={Spacing.XS} />
              <Rating rate={item.rate} />
            </View>
            {item.priceDisplay && (
              <Text
                typography="subhead"
                fontWeight="bold"
                color={theme.colors.primary.default}>
                {item.priceDisplay}
              </Text>
            )}
          </View>
          {item.address && (
            <>
              <SizedBox height={Spacing.S} />
              <Text typography="caption1">{item.address}</Text>
            </>
          )}
        </>
      );
    }

    return (
      <>
        <Skeleton style={styles.gridImage} />
        <SizedBox height={Spacing.S} />
        <SizedBox height={12} width={80}>
          <Skeleton />
        </SizedBox>
        <SizedBox height={Spacing.S} />
        <SizedBox height={12} width={100}>
          <Skeleton />
        </SizedBox>
        <SizedBox height={Spacing.S} />
        <SizedBox height={22} width={60}>
          <Skeleton />
        </SizedBox>
        <SizedBox height={Spacing.S} />
        <SizedBox height={12} width={80}>
          <Skeleton />
        </SizedBox>
      </>
    );
  };

  /**
   * render for block style
   * @returns {JSX.Element}
   */
  const renderBlock = (): JSX.Element => {
    if (item?.id) {
      return (
        <>
          <Image
            source={{uri: item.image?.full}}
            resizeMode="cover"
            style={styles.blockImage}>
            {item.status && (
              <View style={[Styles.row, Styles.paddingS]}>
                <View
                  style={[
                    styles.status,
                    {backgroundColor: theme.colors.primary.default},
                  ]}>
                  <Text
                    typography={'caption1'}
                    fontWeight={'bold'}
                    color={Colors.white}>
                    {item.status}
                  </Text>
                </View>
              </View>
            )}
            <View style={styles.blockFavorite}>
              <Icon
                name={item.favorite ? 'heart' : 'heart-outline'}
                color={Colors.white}
              />
            </View>
            <View style={styles.blockRate}>
              <Rating rate={item.rate} />
              <SizedBox height={Spacing.XXS} />
              <Text
                typography="caption1"
                color={Colors.white}
                fontWeight={'bold'}>
                {item.numRate} {translate('feedback')}
              </Text>
            </View>
          </Image>

          <View style={Styles.paddingM}>
            <Text typography="caption1" color={theme.colors.text.secondary}>
              {item.category?.title}
            </Text>
            <SizedBox height={Spacing.XXS} />
            <Text typography="subhead" fontWeight="bold" numberOfLines={1}>
              {item.title}
            </Text>
            <SizedBox height={Spacing.XS} />
            {item.address && (
              <>
                <SizedBox height={Spacing.XS} />
                <View style={Styles.row}>
                  <Icon
                    name={'map-marker-outline'}
                    size={14}
                    color={theme.colors.primary.default}
                  />
                  <SizedBox width={Spacing.XS} />
                  <Text
                    typography="caption1"
                    numberOfLines={1}
                    style={Styles.flex}>
                    {item.address}
                  </Text>
                </View>
              </>
            )}
            {item.phone && (
              <>
                <SizedBox height={Spacing.XS} />
                <View style={Styles.row}>
                  <Icon
                    name={'phone-outline'}
                    size={14}
                    color={theme.colors.primary.default}
                  />
                  <SizedBox width={Spacing.XS} />
                  <Text typography="caption1">{item.phone}</Text>
                </View>
              </>
            )}
          </View>
        </>
      );
    }

    return (
      <>
        <Skeleton style={styles.blockImage} />
        <View style={Styles.paddingM}>
          <SizedBox height={12} width={80}>
            <Skeleton />
          </SizedBox>
          <SizedBox height={Spacing.S} />
          <SizedBox height={12} width={150}>
            <Skeleton />
          </SizedBox>
          <SizedBox height={Spacing.XS} />
          <SizedBox height={12} width={100}>
            <Skeleton />
          </SizedBox>
          <SizedBox height={Spacing.XS} />
          <SizedBox height={12} width={100}>
            <Skeleton />
          </SizedBox>
        </View>
      </>
    );
  };

  /**
   * render for card style
   * @returns {JSX.Element}
   */
  const renderCard = (): JSX.Element => {
    if (item?.id) {
      return (
        <View
          style={[
            styles.cardContainer,
            {backgroundColor: theme.colors.background.surface},
          ]}>
          <Image
            source={{uri: item.image?.full}}
            resizeMode="cover"
            style={Styles.full}
          />
          <Text
            typography="footnote"
            fontWeight="bold"
            numberOfLines={2}
            color={Colors.white}
            style={styles.titleCard}>
            {item.title}
          </Text>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.cardContainer,
          {backgroundColor: theme.colors.background.surface},
        ]}>
        <Skeleton />
      </View>
    );
  };

  /**
   * render for card full style
   * @returns {JSX.Element}
   */
  const renderCardFull = (): JSX.Element => {
    if (item?.id) {
      return (
        <Image
          source={{uri: item.image?.full}}
          resizeMode="cover"
          style={styles.blockImage}>
          {item.status && (
            <View style={[Styles.row, Styles.paddingS]}>
              <View
                style={[
                  styles.status,
                  {backgroundColor: theme.colors.primary.default},
                ]}>
                <Text
                  typography={'caption1'}
                  fontWeight={'bold'}
                  color={Colors.white}>
                  {item.status}
                </Text>
              </View>
            </View>
          )}
          <View style={styles.blockFavorite}>
            <Icon
              name={item.favorite ? 'heart' : 'heart-outline'}
              color={Colors.white}
            />
          </View>
          <View style={styles.cardInfo}>
            <Text typography="subhead" fontWeight="bold" color={Colors.white}>
              {item.title}
            </Text>
            <SizedBox height={Spacing.XS} />
            <View style={Styles.row}>
              <Icon
                name={'map-marker-outline'}
                size={16}
                color={theme.colors.primary.default}
              />
              <SizedBox width={Spacing.S} />
              <Text
                typography="caption1"
                color={Colors.white}
                fontWeight={'bold'}>
                {item.address}
              </Text>
            </View>
          </View>
          <View style={styles.blockRate}>
            {item.priceDisplay && (
              <>
                <Text
                  typography="subhead"
                  fontWeight="bold"
                  color={Colors.white}>
                  {item.priceDisplay}
                </Text>
                <SizedBox height={Spacing.XS} />
              </>
            )}
            <View style={Styles.row}>
              <Icon name={'star'} size={16} color={'yellow'} />
              <SizedBox width={Spacing.XS} />
              <Text
                typography="caption1"
                color={Colors.white}
                fontWeight={'bold'}>
                {item.rate} {translate('rating')}
              </Text>
            </View>
          </View>
        </Image>
      );
    }

    return <Skeleton style={styles.blockImage} />;
  };

  const renderContent = () => {
    switch (type) {
      case ProductViewType.small:
        return renderSmall;
      case ProductViewType.list:
        return renderList;
      case ProductViewType.grid:
        return renderGrid;
      case ProductViewType.block:
        return renderBlock;
      case ProductViewType.card:
        return renderCard;
      case ProductViewType.cardFull:
        return renderCardFull;
      default:
        return <View />;
    }
  };

  return (
    <Pressable
      style={style}
      onPress={() => onPress(item!)}
      disabled={item?.id === undefined}>
      {renderContent()}
    </Pressable>
  );
};

export {ProductItem};
