import React, {useContext} from 'react';
import {Pressable, StyleProp, View, ViewStyle} from 'react-native';

import styles from './styles';
import {
  ApplicationContext,
  Colors,
  Icon,
  Image,
  Radius,
  Shadow,
  SizedBox,
  Skeleton,
  Spacing,
  Styles,
  Text,
} from '@passionui/components';
import {CategoryModel, CategoryViewType} from '@models+types';
import {convertIcon} from '@utils';

type CategoryItemProps = {
  style?: StyleProp<ViewStyle>;
  item?: CategoryModel;
  onPress: (item: CategoryModel) => void;
  type: CategoryViewType;
};

const CategoryItem: React.FC<CategoryItemProps> = ({
  type,
  item,
  onPress,
  style,
}) => {
  const {theme, translate} = useContext(ApplicationContext);

  /**
   * render for icon-circle style
   * @returns {JSX.Element}
   */
  const renderIconCircle = (): JSX.Element => {
    if (item?.id) {
      return (
        <View style={Styles.columnCenter}>
          <View
            style={[
              styles.icon,
              {backgroundColor: (item.color ?? Colors.black_03) + '4D'},
            ]}>
            <Icon
              name={convertIcon(item.icon || 'folder')}
              size={18}
              color={item.color}
              type="FontAwesome5"
            />
          </View>
          <SizedBox height={Spacing.XS} />
          <Text
            typography="caption1"
            fontWeight={'semibold'}
            numberOfLines={2}
            ellipsizeMode="middle">
            {item.title}
          </Text>
        </View>
      );
    }

    return (
      <View style={Styles.columnCenter}>
        <Skeleton style={styles.icon} />
        <SizedBox height={Spacing.S} />
        <SizedBox height={10} width={40}>
          <Skeleton />
        </SizedBox>
      </View>
    );
  };

  /**
   * render for icon-square style
   * @returns {JSX.Element}
   */
  const renderIconSquare = (): JSX.Element => {
    if (item?.id) {
      return (
        <View
          style={[
            Shadow.light,
            styles.iconSquare,
            {backgroundColor: theme.colors.background.surface},
          ]}>
          <View
            style={[
              styles.icon,
              {backgroundColor: (item.color ?? Colors.black_03) + '4D'},
            ]}>
            <Icon
              name={convertIcon(item.icon || 'folder')}
              size={18}
              color={item.color}
              type="FontAwesome5"
            />
          </View>
          <SizedBox height={Spacing.S} />
          <Text
            typography="subhead"
            fontWeight={'bold'}
            numberOfLines={2}
            ellipsizeMode="middle">
            {item.title}
          </Text>
          <SizedBox height={Spacing.XXS} />
          <Text typography="caption1">
            {item.count} {translate('location')}
          </Text>
        </View>
      );
    }

    return (
      <View
        style={[
          Shadow.light,
          styles.iconSquare,
          {backgroundColor: theme.colors.background.surface},
        ]}>
        <Skeleton style={styles.icon} />
        <SizedBox height={Spacing.S} />
        <SizedBox height={10} width={40}>
          <Skeleton />
        </SizedBox>
        <SizedBox height={Spacing.S} />
        <SizedBox height={10} width={60}>
          <Skeleton />
        </SizedBox>
      </View>
    );
  };

  /**
   * render for icon-landscape style
   * @returns {JSX.Element}
   */
  const renderIconLandscape = (): JSX.Element => {
    if (item?.id) {
      return (
        <View
          style={[
            Shadow.light,
            styles.iconLandscape,
            {backgroundColor: theme.colors.background.surface},
          ]}>
          <View
            style={[
              styles.icon,
              {backgroundColor: (item.color ?? Colors.black_03) + '4D'},
            ]}>
            <Icon
              name={convertIcon(item.icon || 'folder')}
              size={18}
              color={item.color}
              type="FontAwesome5"
            />
          </View>
          <SizedBox height={Spacing.S} />
          <Text
            typography="subhead"
            fontWeight={'bold'}
            numberOfLines={2}
            ellipsizeMode="middle">
            {item.title}
          </Text>
          <SizedBox height={Spacing.XXS} />
          <Text typography="caption1">
            {item.count} {translate('location')}
          </Text>
        </View>
      );
    }

    return (
      <View
        style={[
          Shadow.light,
          styles.iconLandscape,
          {backgroundColor: theme.colors.background.surface},
        ]}>
        <Skeleton style={styles.icon} />
        <SizedBox height={Spacing.S} />
        <SizedBox height={10} width={40}>
          <Skeleton />
        </SizedBox>
        <SizedBox height={Spacing.S} />
        <SizedBox height={10} width={60}>
          <Skeleton />
        </SizedBox>
      </View>
    );
  };

  /**
   * render for icon-portrait style
   * @returns {JSX.Element}
   */
  const renderIconPortrait = (): JSX.Element => {
    if (item?.id) {
      return (
        <View
          style={[
            Shadow.light,
            styles.iconPortrait,
            {backgroundColor: theme.colors.background.surface},
          ]}>
          <View
            style={[
              styles.icon,
              {backgroundColor: (item.color ?? Colors.black_03) + '4D'},
            ]}>
            <Icon
              name={convertIcon(item.icon || 'folder')}
              size={18}
              color={item.color}
              type="FontAwesome5"
            />
          </View>
          <SizedBox height={Spacing.S} />
          <Text
            typography="subhead"
            fontWeight={'bold'}
            numberOfLines={2}
            ellipsizeMode="middle">
            {item.title}
          </Text>
          <SizedBox height={Spacing.XXS} />
          <Text typography="caption1">
            {item.count} {translate('location')}
          </Text>
        </View>
      );
    }

    return (
      <View
        style={[
          Shadow.light,
          styles.iconPortrait,
          {backgroundColor: theme.colors.background.surface},
        ]}>
        <Skeleton style={styles.icon} />
        <SizedBox height={Spacing.S} />
        <SizedBox height={10} width={40}>
          <Skeleton />
        </SizedBox>
        <SizedBox height={Spacing.S} />
        <SizedBox height={10} width={60}>
          <Skeleton />
        </SizedBox>
      </View>
    );
  };

  /**
   * render for icon-round style
   * @returns {JSX.Element}
   */
  const renderIconRound = (): JSX.Element => {
    if (item?.id) {
      return (
        <View style={Styles.columnCenter}>
          <View
            style={[
              styles.iconRound,
              {backgroundColor: (item.color ?? Colors.black_03) + '4D'},
            ]}>
            <Icon
              name={convertIcon(item.icon || 'folder')}
              color={item.color}
              type="FontAwesome5"
            />
          </View>
          <SizedBox height={Spacing.S} />
          <Text
            typography="subhead"
            fontWeight={'bold'}
            numberOfLines={2}
            ellipsizeMode="middle">
            {item.title}
          </Text>
        </View>
      );
    }

    return (
      <View style={Styles.columnCenter}>
        <Skeleton style={styles.iconRound} />
        <SizedBox height={Spacing.S} />
        <SizedBox height={12} width={40}>
          <Skeleton />
        </SizedBox>
      </View>
    );
  };

  /**
   * render for icon-circle-list style
   * @returns {JSX.Element}
   */
  const renderIconCircleList = (): JSX.Element => {
    if (item?.id) {
      return (
        <View
          style={[
            styles.listContainer,
            {backgroundColor: theme.colors.background.surface},
            Shadow.light,
          ]}>
          <View style={[styles.icon, {backgroundColor: item.color + '4D'}]}>
            <Icon
              name={convertIcon(item.icon || 'folder')}
              size={18}
              color={item.color}
              type="FontAwesome5"
            />
          </View>
          <SizedBox width={Spacing.S} />
          <View>
            <Text typography="subhead" fontWeight={'bold'}>
              {item.title}
            </Text>
            <SizedBox height={Spacing.XXS} />
            <Text typography="caption1">
              {item.count} {translate('location')}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.listContainer,
          {backgroundColor: theme.colors.background.surface},
          Shadow.light,
        ]}>
        <Skeleton style={styles.icon} />
        <SizedBox height={Spacing.S} />
        <SizedBox height={8} width={40}>
          <Skeleton />
        </SizedBox>
      </View>
    );
  };

  /**
   * render for icon-round-list style
   * @returns {JSX.Element}
   */
  const renderIconRoundList = (): JSX.Element => {
    if (item?.id) {
      return (
        <View
          style={[
            styles.listContainer,
            {backgroundColor: theme.colors.background.surface},
            Shadow.light,
          ]}>
          <View
            style={[styles.iconRound, {backgroundColor: item.color + '4D'}]}>
            <Icon
              name={convertIcon(item.icon || 'folder')}
              size={18}
              color={item.color}
              type="FontAwesome5"
            />
          </View>
          <SizedBox width={Spacing.S} />
          <View>
            <Text typography="subhead" fontWeight={'bold'}>
              {item.title}
            </Text>
            <SizedBox height={Spacing.XXS} />
            <Text typography="caption1">
              {item.count} {translate('location')}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.listContainer,
          {backgroundColor: theme.colors.background.surface},
          Shadow.light,
        ]}>
        <Skeleton style={styles.iconRound} />
        <SizedBox width={Spacing.S} />
        <View>
          <SizedBox height={12} width={40}>
            <Skeleton />
          </SizedBox>
          <SizedBox height={Spacing.S} />
          <SizedBox height={12} width={60}>
            <Skeleton />
          </SizedBox>
        </View>
      </View>
    );
  };

  /**
   * render for icon-shape-list style
   * @returns {JSX.Element}
   */
  const renderIconShapeList = (): JSX.Element => {
    if (item?.id) {
      return (
        <View
          style={[
            styles.listShapeContainer,
            {backgroundColor: theme.colors.background.surface},
            Shadow.light,
          ]}>
          <View>
            <View style={[styles.icon, {backgroundColor: item.color + '4D'}]}>
              <Icon
                name={convertIcon(item.icon!)}
                size={18}
                color={item.color}
                type="FontAwesome5"
              />
            </View>
            <SizedBox height={Spacing.S} />
            <View>
              <Text typography="subhead" fontWeight={'bold'}>
                {item.title}
              </Text>
              <SizedBox height={Spacing.XXS} />
              <Text typography="caption1">
                {item.count} {translate('location')}
              </Text>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.listShapeContainer,
          {backgroundColor: theme.colors.background.surface},
          Shadow.light,
        ]}>
        <Skeleton style={styles.icon} />
        <SizedBox height={Spacing.S} />
        <SizedBox height={8} width={40}>
          <Skeleton />
        </SizedBox>
      </View>
    );
  };

  /**
   * render for image-circle style
   * @returns {JSX.Element}
   */
  const renderImageCircle = (): JSX.Element => {
    if (item?.id) {
      return (
        <View style={Styles.columnCenter}>
          <Image style={styles.imageCircle} source={{uri: item.image?.full}} />
          <SizedBox height={Spacing.XS} />
          <Text
            typography="caption1"
            fontWeight={'semibold'}
            numberOfLines={2}
            ellipsizeMode="middle">
            {item.title}
          </Text>
        </View>
      );
    }

    return (
      <View style={Styles.columnCenter}>
        <Skeleton style={styles.imageCircle} />
        <SizedBox height={Spacing.S} />
        <SizedBox height={10} width={40}>
          <Skeleton />
        </SizedBox>
      </View>
    );
  };

  /**
   * render for image-round style
   * @returns {JSX.Element}
   */
  const renderImageRound = (): JSX.Element => {
    if (item?.id) {
      return (
        <View style={Styles.columnCenter}>
          <Image style={styles.imageRound} source={{uri: item.image?.full}} />
          <SizedBox height={Spacing.S} />
          <Text
            typography="subhead"
            fontWeight={'bold'}
            numberOfLines={2}
            ellipsizeMode="middle">
            {item.title}
          </Text>
        </View>
      );
    }

    return (
      <View style={Styles.columnCenter}>
        <Skeleton style={styles.imageRound} />
        <SizedBox height={Spacing.S} />
        <SizedBox height={12} width={40}>
          <Skeleton />
        </SizedBox>
      </View>
    );
  };

  /**
   * render for image-square style
   * @returns {JSX.Element}
   */
  const renderImageSquare = (): JSX.Element => {
    if (item?.id) {
      return (
        <View style={Styles.columnCenter}>
          <Image style={styles.imageSquare} source={{uri: item.image?.full}} />
          <SizedBox height={Spacing.S} />
          <Text
            typography="subhead"
            fontWeight={'bold'}
            numberOfLines={2}
            ellipsizeMode="middle">
            {item.title}
          </Text>
          <SizedBox height={Spacing.XXS} />
          <Text typography="caption1">
            {item.count} {translate('location')}
          </Text>
        </View>
      );
    }

    return (
      <View style={Styles.columnCenter}>
        <Skeleton style={styles.imageSquare} />
        <SizedBox height={Spacing.S} />
        <SizedBox height={10} width={40}>
          <Skeleton />
        </SizedBox>
        <SizedBox height={Spacing.S} />
        <SizedBox height={10} width={60}>
          <Skeleton />
        </SizedBox>
      </View>
    );
  };

  /**
   * render for image-landscape style
   * @returns {JSX.Element}
   */
  const renderImageLandscape = (): JSX.Element => {
    if (item?.id) {
      return (
        <View style={Styles.columnCenterLeft}>
          <Image
            style={styles.imageLandscape}
            source={{uri: item.image?.full}}
          />
          <SizedBox height={Spacing.S} />
          <Text
            typography="subhead"
            fontWeight={'bold'}
            numberOfLines={2}
            ellipsizeMode="middle">
            {item.title}
          </Text>
          <SizedBox height={Spacing.XXS} />
          <Text typography="caption1">
            {item.count} {translate('location')}
          </Text>
        </View>
      );
    }

    return (
      <View style={Styles.columnCenterLeft}>
        <Skeleton style={styles.imageLandscape} />
        <SizedBox height={Spacing.S} />
        <SizedBox height={10} width={40}>
          <Skeleton />
        </SizedBox>
        <SizedBox height={Spacing.S} />
        <SizedBox height={10} width={60}>
          <Skeleton />
        </SizedBox>
      </View>
    );
  };

  /**
   * render for image-circle-list style
   * @returns {JSX.Element}
   */
  const renderImageCircleList = (): JSX.Element => {
    if (item?.id) {
      return (
        <View
          style={[
            styles.listContainer,
            {backgroundColor: theme.colors.background.surface},
            Shadow.light,
          ]}>
          <Image style={styles.imageCircle} source={{uri: item.image?.full}} />
          <SizedBox width={Spacing.S} />
          <View>
            <Text typography="footnote" fontWeight={'bold'}>
              {item.title}
            </Text>
            <SizedBox height={Spacing.XXS} />
            <Text typography="caption1">
              {item.count} {translate('location')}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.listContainer,
          {backgroundColor: theme.colors.background.surface},
          Shadow.light,
        ]}>
        <Skeleton style={styles.imageCircle} />
        <SizedBox width={Spacing.S} />
        <View>
          <SizedBox height={12} width={40}>
            <Skeleton />
          </SizedBox>
          <SizedBox height={Spacing.S} />
          <SizedBox height={12} width={60}>
            <Skeleton />
          </SizedBox>
        </View>
      </View>
    );
  };

  /**
   * render for image-round-list style
   * @returns {JSX.Element}
   */
  const renderImageRoundList = (): JSX.Element => {
    if (item?.id) {
      return (
        <View
          style={[
            styles.listContainer,
            {backgroundColor: theme.colors.background.surface},
            Shadow.light,
          ]}>
          <Image style={styles.imageRound} source={{uri: item.image?.full}} />
          <SizedBox width={Spacing.S} />
          <View>
            <Text typography="subhead" fontWeight={'bold'}>
              {item.title}
            </Text>
            <SizedBox height={Spacing.XXS} />
            <Text typography="caption1">
              {item.count} {translate('location')}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.listContainer,
          {backgroundColor: theme.colors.background.surface},
          Shadow.light,
        ]}>
        <Skeleton style={styles.imageRound} />
        <SizedBox width={Spacing.S} />
        <View>
          <SizedBox height={12} width={40}>
            <Skeleton />
          </SizedBox>
          <SizedBox height={Spacing.S} />
          <SizedBox height={12} width={60}>
            <Skeleton />
          </SizedBox>
        </View>
      </View>
    );
  };

  /**
   * render for image-shape-list style
   * @returns {JSX.Element}
   */
  const renderImageShapeList = (): JSX.Element => {
    if (item?.id) {
      return (
        <View>
          <Image
            style={styles.listShapeContainer}
            source={{uri: item.image?.full}}
          />
          <SizedBox height={Spacing.S} />
          <Text
            typography="subhead"
            fontWeight={'bold'}
            numberOfLines={2}
            ellipsizeMode="middle">
            {item.title}
          </Text>
          <SizedBox height={Spacing.XXS} />
          <Text typography="caption1">
            {item.count} {translate('location')}
          </Text>
        </View>
      );
    }

    return (
      <View>
        <Skeleton style={styles.listShapeContainer} />
        <SizedBox height={Spacing.S} />
        <SizedBox height={10} width={40}>
          <Skeleton />
        </SizedBox>
        <SizedBox height={Spacing.S} />
        <SizedBox height={10} width={60}>
          <Skeleton />
        </SizedBox>
      </View>
    );
  };

  /**
   * render for icon-portrait style
   * @returns {JSX.Element}
   */
  const renderImagePortrait = (): JSX.Element => {
    if (item?.id) {
      return (
        <View style={Styles.columnCenterLeft}>
          <Image
            style={styles.imagePortrait}
            source={{uri: item.image?.full}}
          />
          <SizedBox height={Spacing.S} />
          <Text
            typography="subhead"
            fontWeight={'bold'}
            numberOfLines={2}
            ellipsizeMode="middle">
            {item.title}
          </Text>
          <SizedBox height={Spacing.XXS} />
          <Text typography="caption1">
            {item.count} {translate('location')}
          </Text>
        </View>
      );
    }

    return (
      <View style={Styles.columnCenterLeft}>
        <Skeleton style={styles.imagePortrait} />
        <SizedBox height={Spacing.S} />
        <SizedBox height={10} width={40}>
          <Skeleton />
        </SizedBox>
        <SizedBox height={Spacing.S} />
        <SizedBox height={10} width={60}>
          <Skeleton />
        </SizedBox>
      </View>
    );
  };

  /**
   * render for full style
   * @returns {JSX.Element}
   */
  const renderFull = (): JSX.Element => {
    if (item?.id) {
      return (
        <View style={[styles.fullContainer, Shadow.light]}>
          <Image source={{uri: item.image?.full}} style={styles.fullImage}>
            <View style={[Styles.row, Styles.paddingS]}>
              <View style={[styles.icon, {backgroundColor: item.color}]}>
                <Icon
                  name={convertIcon(item.icon!)}
                  size={18}
                  color={Colors.white}
                  type="FontAwesome5"
                />
              </View>
              <SizedBox width={Spacing.S} />
              <View>
                <Text
                  typography="subhead"
                  fontWeight={'bold'}
                  color={Colors.white}>
                  {item.title}
                </Text>
                <SizedBox height={Spacing.XXS} />
                <Text typography="caption1" color={Colors.white}>
                  {item.count} {translate('location')}
                </Text>
              </View>
            </View>
          </Image>
        </View>
      );
    }

    return (
      <View style={[styles.fullContainer, Shadow.light]}>
        <Skeleton style={{borderRadius: Radius.M}} />
      </View>
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
            styles.card,
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
          styles.card,
          {backgroundColor: theme.colors.background.surface},
        ]}>
        <Skeleton />
      </View>
    );
  };

  /**
   * render content
   */
  const renderContent = (): JSX.Element => {
    switch (type) {
      case CategoryViewType.iconCircle:
        return renderIconCircle();
      case CategoryViewType.iconSquare:
        return renderIconSquare();
      case CategoryViewType.iconLandscape:
        return renderIconLandscape();
      case CategoryViewType.iconPortrait:
        return renderIconPortrait();
      case CategoryViewType.iconRound:
        return renderIconRound();
      case CategoryViewType.iconCircleList:
        return renderIconCircleList();
      case CategoryViewType.iconRoundList:
        return renderIconRoundList();
      case CategoryViewType.iconSquareList:
      case CategoryViewType.iconPortraitList:
      case CategoryViewType.iconLandscapeList:
        return renderIconShapeList();

      case CategoryViewType.imageCircle:
        return renderImageCircle();
      case CategoryViewType.imageRound:
        return renderImageRound();
      case CategoryViewType.imageSquare:
        return renderImageSquare();
      case CategoryViewType.imageLandscape:
        return renderImageLandscape();
      case CategoryViewType.imagePortrait:
        return renderImagePortrait();
      case CategoryViewType.imageCircleList:
        return renderImageCircleList();
      case CategoryViewType.imageRoundList:
        return renderImageRoundList();
      case CategoryViewType.imageSquareList:
      case CategoryViewType.imageLandscapeList:
      case CategoryViewType.imagePortraitList:
        return renderImageShapeList();
      case CategoryViewType.full:
        return renderFull();
      default:
        return renderCard();
    }
  };

  return (
    <Pressable
      onPress={() => onPress(item!)}
      disabled={item?.id === undefined}
      style={style}>
      {renderContent()}
    </Pressable>
  );
};

export {CategoryItem};
