import React, {useContext} from 'react';
import {
  ApplicationContext,
  Image,
  Shadow,
  SizedBox,
  Skeleton,
  Spacing,
  Styles,
  Text,
} from '@passionui/components';
import {StyleProp, View, ViewStyle} from 'react-native';
import styles from './styles';
import {CommentModel} from '@models+types';
import {Rating} from '@components';
import moment from 'moment';

type ReviewItemProps = {
  item?: CommentModel;
  style?: StyleProp<ViewStyle>;
};

const CommentItem: React.FC<ReviewItemProps> = ({item, style}) => {
  const {theme} = useContext(ApplicationContext);

  if (item?.id) {
    return (
      <View
        style={[
          Shadow.light,
          styles.container,
          {backgroundColor: theme.colors.background.surface},
          style,
        ]}>
        <View style={Styles.rowSpace}>
          <View style={Styles.row}>
            <Image style={styles.authorImage} source={{uri: item.user.image}} />
            <SizedBox width={Spacing.S} />
            <View>
              <Text typography={'subhead'} fontWeight={'bold'}>
                {item.user.name}
              </Text>
              <SizedBox height={Spacing.XXS} />
              <Rating rate={item.rate} />
            </View>
          </View>
          <Text typography={'caption1'}>
            {moment(item.createDate)?.format('MMMM D, YYYY')}
          </Text>
        </View>
        <SizedBox height={Spacing.S} />
        <Text typography={'footnote'}>{item.content}</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        Shadow.light,
        styles.container,
        {backgroundColor: theme.colors.background.surface},
        style,
      ]}>
      <View style={Styles.rowSpace}>
        <View style={Styles.row}>
          <Skeleton style={styles.authorImage} />
          <SizedBox width={Spacing.S} />
          <View>
            <SizedBox height={14} width={100}>
              <Skeleton />
            </SizedBox>

            <SizedBox height={Spacing.XXS} />
            <SizedBox height={14} width={80}>
              <Skeleton />
            </SizedBox>
          </View>
        </View>
        <SizedBox height={14} width={60}>
          <Skeleton />
        </SizedBox>
      </View>
      <Skeleton style={styles.line} />
      <Skeleton style={styles.line} />
      <Skeleton style={styles.line} />
    </View>
  );
};

export {CommentItem};
