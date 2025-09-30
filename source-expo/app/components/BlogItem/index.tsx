import React, {useContext} from 'react';
import {Pressable, StyleProp, View, ViewStyle} from 'react-native';
import {BlogModel, CategoryModel} from '@models+types';
import {
  ApplicationContext,
  Image,
  SizedBox,
  Skeleton,
  Spacing,
  Styles,
  Text,
} from '@passionui/components';
import styles from './styles';
import moment from 'moment';

export type BlogItemProps = {
  style?: StyleProp<ViewStyle>;
  item?: BlogModel;
  onPress: (item: BlogModel) => void;
  type: BlogViewType;
};

export enum BlogViewType {
  list = 'list',
  sticky = 'sticky',
  grid = 'grid',
  block = 'block',
}

const BlogItem: React.FC<BlogItemProps> = ({style, item, onPress, type}) => {
  const {theme} = useContext(ApplicationContext);

  /**
   * render for list style
   * @returns {JSX.Element}
   */
  const renderList = (): JSX.Element => {
    if (item?.id) {
      return (
        <View style={Styles.row}>
          <View style={Styles.flex}>
            <Text
              typography={'caption1'}
              color={theme.colors.text.secondary}
              numberOfLines={1}>
              {item.category?.map?.((i: CategoryModel) => i.title).join(', ')}
            </Text>
            <SizedBox height={Spacing.XS} />
            <Text typography={'subhead'} fontWeight={'bold'} numberOfLines={2}>
              {item.title}
            </Text>
            <SizedBox height={Spacing.S} />
            <View style={Styles.row}>
              <Image
                style={styles.authorImage}
                source={{uri: item.author?.image}}
              />
              <SizedBox width={Spacing.S} />
              <View>
                <Text typography={'subhead'} fontWeight={'bold'}>
                  {item.author?.name}
                </Text>
                <SizedBox height={Spacing.XXS} />
                <Text
                  typography={'caption1'}
                  color={theme.colors.text.secondary}>
                  {moment(item.createDate)?.format('MMMM D, YYYY')}
                </Text>
              </View>
            </View>
          </View>
          <SizedBox width={Spacing.S} />
          <Image style={styles.listImage} source={{uri: item.image?.full}} />
        </View>
      );
    }

    return (
      <View style={Styles.row}>
        <View style={Styles.flex}>
          <SizedBox width={100} height={10}>
            <Skeleton />
          </SizedBox>
          <SizedBox height={Spacing.S} />
          <SizedBox width={120} height={10}>
            <Skeleton />
          </SizedBox>
          <SizedBox height={Spacing.XS} />
          <SizedBox width={150} height={10}>
            <Skeleton />
          </SizedBox>
          <SizedBox height={Spacing.S} />
          <View style={Styles.row}>
            <Skeleton style={styles.authorImage} />
            <SizedBox width={Spacing.M} />
            <View>
              <SizedBox width={100} height={10}>
                <Skeleton />
              </SizedBox>
              <SizedBox height={Spacing.XS} />
              <SizedBox width={120} height={10}>
                <Skeleton />
              </SizedBox>
            </View>
          </View>
        </View>
        <SizedBox width={Spacing.S} />
        <Skeleton style={styles.listImage} />
      </View>
    );
  };

  /**
   * render for grid style
   * @returns {JSX.Element}
   */
  const renderGrid = (): JSX.Element => {
    if (item?.id) {
      return (
        <View>
          <Image style={styles.gridImage} source={{uri: item.image?.full}} />
          <SizedBox height={Spacing.S} />
          <Text typography={'subhead'} fontWeight={'bold'} numberOfLines={2}>
            {item.title}
          </Text>
        </View>
      );
    }

    return (
      <View>
        <Skeleton style={styles.gridImage} />
        <SizedBox height={Spacing.S} />
        <SizedBox width={150} height={14}>
          <Skeleton />
        </SizedBox>
      </View>
    );
  };

  /**
   * render for block style
   * @returns {JSX.Element}
   */
  const renderBlock = (): JSX.Element => {
    if (item?.id) {
      return (
        <View>
          <Image style={styles.blockImage} source={{uri: item.image?.full}} />
          <SizedBox height={Spacing.S} />
          <Text typography={'subhead'} fontWeight={'bold'} numberOfLines={2}>
            {item.title}
          </Text>
          <SizedBox height={Spacing.S} />
          <View style={Styles.row}>
            <Image
              style={styles.authorImage}
              source={{uri: item.author?.image}}
            />
            <SizedBox width={Spacing.S} />
            <View>
              <Text typography={'subhead'} fontWeight={'bold'}>
                {item.author?.name}
              </Text>
              <SizedBox height={Spacing.XXS} />
              <Text typography={'caption1'} color={theme.colors.text.secondary}>
                {moment(item.createDate)?.format('MMMM D, YYYY')}
              </Text>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View>
        <Skeleton style={styles.blockImage} />
        <SizedBox height={Spacing.S} />
        <SizedBox width={150} height={14}>
          <Skeleton />
        </SizedBox>
        <SizedBox height={Spacing.S} />
        <View style={Styles.row}>
          <Skeleton style={styles.authorImage} />
          <SizedBox width={Spacing.M} />
          <View>
            <SizedBox width={100} height={10}>
              <Skeleton />
            </SizedBox>
            <SizedBox height={Spacing.XS} />
            <SizedBox width={120} height={10}>
              <Skeleton />
            </SizedBox>
          </View>
        </View>
      </View>
    );
  };

  /**
   * render for sticky style
   * @returns {JSX.Element}
   */
  const renderSticky = (): JSX.Element => {
    if (item?.id) {
      return (
        <View>
          <Image style={styles.stickyImage} source={{uri: item.image?.full}} />
          <SizedBox height={Spacing.S} />
          <Text typography={'subhead'} fontWeight={'bold'} numberOfLines={2}>
            {item.title}
          </Text>
          <SizedBox height={Spacing.S} />
          <View style={Styles.rowSpace}>
            <View style={[Styles.flex, Styles.row]}>
              <Image
                style={styles.authorImage}
                source={{uri: item.author?.image}}
              />
              <SizedBox width={Spacing.S} />
              <View>
                <Text typography={'subhead'} fontWeight={'bold'}>
                  {item.author?.name}
                </Text>
                <SizedBox height={Spacing.XXS} />
                <Text
                  typography={'caption1'}
                  color={theme.colors.text.secondary}>
                  {moment(item.createDate)?.format('MMMM D, YYYY')}
                </Text>
              </View>
            </View>
            <Text
              typography={'caption1'}
              color={theme.colors.text.secondary}
              numberOfLines={1}>
              {item.category?.map?.((i: CategoryModel) => i.title).join(', ')}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View>
        <Skeleton style={styles.stickyImage} />
        <SizedBox height={Spacing.S} />
        <SizedBox width={100} height={10}>
          <Skeleton />
        </SizedBox>
        <SizedBox height={Spacing.S} />
        <View style={Styles.rowSpace}>
          <View style={[Styles.flex, Styles.row]}>
            <Skeleton style={styles.authorImage} />
            <SizedBox width={Spacing.S} />
            <View>
              <SizedBox width={100} height={10}>
                <Skeleton />
              </SizedBox>
              <SizedBox height={Spacing.XXS} />
              <SizedBox width={150} height={10}>
                <Skeleton />
              </SizedBox>
            </View>
          </View>
          <SizedBox width={50} height={10}>
            <Skeleton />
          </SizedBox>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    switch (type) {
      case BlogViewType.list:
        return renderList;
      case BlogViewType.grid:
        return renderGrid;
      case BlogViewType.block:
        return renderBlock;
      case BlogViewType.sticky:
        return renderSticky;
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

export {BlogItem};
