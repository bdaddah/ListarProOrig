import React, {useContext, useEffect, useState} from 'react';
import {
  ApplicationContext,
  HeaderRightAction,
  NavigationButton,
  Screen,
  ScreenContainerProps,
  SizedBox,
  Spacing,
  Styles,
} from '@passionui/components';

import {FlatList, RefreshControl, View} from 'react-native';
import {CommentItem, Empty, RateSummary, SpaceList} from '@components';
import Assets from '@assets';
import {useSelector} from 'react-redux';
import {reviewActions, reviewSelect} from '@redux';
import {Authentication, FeedBack} from '@screens';
import styles from './styles';

const Review: React.FC<ScreenContainerProps> = ({navigation, ...params}) => {
  const {theme, navigator, translate} = useContext(ApplicationContext);
  const [refreshing, setRefreshing] = useState(false);
  const review = useSelector(reviewSelect);

  useEffect(() => {
    reviewActions.onLoad(params.item);
    return () => {
      reviewActions.onReset();
    };
  }, [params.item]);

  /**
   * on refresh
   */
  const onRefresh = async () => {
    setRefreshing(true);
    reviewActions.onLoad(params.item, () => {
      setRefreshing(false);
    });
  };

  /**
   * on feedback
   */
  const onFeedBack = () => {
    navigator?.push({
      screen: props => <Authentication {...props} screen={FeedBack} />,
      item: params.item,
      reload: () => {
        reviewActions.onLoad(params.item);
        params.reload?.();
      },
    });
  };

  const headerRight = (props: any) => {
    return (
      <HeaderRightAction {...props}>
        <NavigationButton icon={'comment-plus-outline'} onPress={onFeedBack} />
      </HeaderRightAction>
    );
  };

  return (
    <Screen
      navigation={navigation}
      edges={['bottom']}
      options={{title: translate('review'), headerRight}}>
      <SizedBox height={Spacing.M} />
      {review.summary?.total > 0 && (
        <View style={styles.summaryContainer}>
          <RateSummary data={review.summary} />
        </View>
      )}
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.text.default}
            title={translate('pull_to_reload')}
            titleColor={theme.colors.text.default}
            colors={[theme.colors.primary.default]}
            progressBackgroundColor={theme.colors.background.surface}
          />
        }
        ListEmptyComponent={
          <Empty
            image={Assets.image.empty}
            title={translate('data_not_found')}
            message={translate('please_try_again')}
            action={{title: translate('try_again'), onPress: onRefresh}}
          />
        }
        ItemSeparatorComponent={SpaceList}
        data={review.data ?? Array.from(Array(15).keys())}
        renderItem={({item}) => {
          return <CommentItem item={item} />;
        }}
        contentContainerStyle={Styles.paddingHorizontalM}
        keyExtractor={(item, index) => `review${item?.id ?? index}`}
      />
    </Screen>
  );
};

export {Review};
