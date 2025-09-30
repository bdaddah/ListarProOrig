import React, {useContext, useEffect, useState} from 'react';
import {
  ApplicationContext,
  HeaderRightAction,
  IconButton,
  Image,
  NavigationButton,
  Screen,
  ScreenContainerProps,
  SizedBox,
  Skeleton,
  Spacing,
  Styles,
  Text,
} from '@passionui/components';
import {WebView} from 'react-native-webview';

import {blogActions} from '@redux';
import {BlogModel} from '@models+types';
import {View} from 'react-native';
import styles from './styles';
import {Authentication, Review, FeedBack} from '@screens';
import moment from 'moment';

const BlogDetail: React.FC<ScreenContainerProps> = ({
  navigation,
  ...params
}) => {
  const {theme, navigator, translate} = useContext(ApplicationContext);
  const [webViewHeight, setWebViewHeight] = useState(100);
  const [blog, setBlog] = useState<BlogModel>();

  useEffect(() => {
    blogActions.onDetail(params.item, setBlog);
  }, [params.item]);

  /**
   *
   */
  const onFeedBack = () => {
    navigator?.push({
      screen: props => <Authentication {...props} screen={FeedBack} />,
      item: blog,
      reload: () => {
        blogActions.onDetail(params.item, setBlog);
      },
    });
  };

  /**
   * on review
   */
  const onReview = () => {
    navigator?.push({
      screen: Review,
      item: blog,
      reload: () => {
        blogActions.onDetail(params.item, setBlog);
      },
    });
  };

  const buildContent = () => {
    if (blog) {
      return (
        <>
          <Text typography={'subhead'} fontWeight={'bold'} numberOfLines={2}>
            {blog?.title}
          </Text>
          <SizedBox height={Spacing.S} />
          <View style={Styles.rowSpace}>
            <View style={Styles.row}>
              <Image
                source={{uri: blog.author?.image}}
                style={styles.authorAvatar}
              />
              <SizedBox width={Spacing.S} />
              <Text typography={'subhead'} fontWeight={'bold'}>
                {blog.author?.name}
              </Text>
              <SizedBox width={Spacing.S} />
              <Text typography={'caption1'}>
                {moment(blog.createDate)?.format('MMMM D, YYYY')}
              </Text>
            </View>
            {!!blog?.numComments && (
              <View style={Styles.row}>
                <Text
                  typography={'subhead'}
                  fontWeight={'bold'}
                  color={theme.colors.primary.default}>
                  {blog.numComments}
                </Text>
                <IconButton
                  icon={'comment-outline'}
                  type={'secondary'}
                  size={'medium'}
                  color={theme.colors.primary.default}
                  onPress={onReview}
                />
              </View>
            )}
          </View>
          <SizedBox height={Spacing.S} />
          <Image source={{uri: blog.image?.full}} style={styles.image} />
          <SizedBox height={Spacing.S} />
          <WebView
            source={{
              html: `
                    <html lang="en">
                    <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Font Size Configuration</title>
                    <style>
                      body {
                        margin: 0;
                        font-family: Arial, sans-serif;
                        color: ${theme.colors.text.default};
                      }
                    </style>
                    </head>
                    <body>
                    ${blog.description}
                    </body>
                    </html>
            `,
            }}
            originWhitelist={['*']}
            scrollEnabled={false}
            injectedJavaScript={`
                (function() {
                  var height = document.documentElement.scrollHeight || document.body.scrollHeight;
                  window.ReactNativeWebView.postMessage(height.toString());
                })();
            `}
            onMessage={event => {
              setWebViewHeight(Number(event.nativeEvent.data));
            }}
            style={[styles.webviewContainer, {height: webViewHeight}]}
          />
        </>
      );
    }

    return (
      <>
        <SizedBox height={14} width={150}>
          <Skeleton />
        </SizedBox>
        <SizedBox height={Spacing.S} />
        <View style={Styles.rowSpace}>
          <View style={Styles.row}>
            <Skeleton style={styles.authorAvatar} />
            <SizedBox width={Spacing.S} />
            <SizedBox height={14} width={100}>
              <Skeleton />
            </SizedBox>
          </View>
          <SizedBox height={24} width={24}>
            <Skeleton />
          </SizedBox>
        </View>
        <SizedBox height={Spacing.S} />
        <Skeleton style={styles.image} />
        <SizedBox height={Spacing.S} />
        <Skeleton style={styles.line} />
        <Skeleton style={styles.line} />
        <Skeleton style={styles.line} />
        <Skeleton style={styles.line} />
        <Skeleton style={styles.line} />
        <Skeleton style={styles.line} />
        <Skeleton style={styles.line} />
      </>
    );
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
      options={{title: translate('blog'), headerRight}}
      scrollable={true}
      scrollViewProps={{contentContainerStyle: Styles.paddingM}}>
      {buildContent()}
    </Screen>
  );
};

export {BlogDetail};
