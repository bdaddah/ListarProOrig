import {
  ApplicationContext,
  Radius,
  Screen,
  ScreenContainerProps,
  Shadow,
  SizedBox,
  Spacing,
  Styles,
  TabView,
  Text,
} from '@passionui/components';
import React, {useContext, useRef} from 'react';
import {StyleSheet, View} from 'react-native';

const TabBarUsage: React.FC<ScreenContainerProps> = ({navigation}) => {
  const {theme} = useContext(ApplicationContext);
  const pagerRef = useRef<any>(null);

  return (
    <Screen
      enableKeyboardAvoidingView={true}
      navigation={navigation}
      options={{
        title: 'TabBarUsage',
      }}
      style={Styles.paddingM}>
      <View
        style={[
          Shadow.light,
          {
            backgroundColor: theme.colors.background.surface,
            padding: Spacing.M,
            borderRadius: Radius.M,
          },
        ]}>
        <TabView
          tabs={[
            {label: 'Demo 1', icon: 'delete-outline'},
            {label: 'Demo 2', icon: 'home-outline'},
            {label: 'Demo 3', icon: 'bookmark-outline'},
          ]}
          direction={'column'}
          initialIndex={0}
        />
      </View>
      <SizedBox height={Spacing.M} />
      <View
        style={[
          Shadow.light,
          {
            backgroundColor: theme.colors.background.surface,
            padding: Spacing.M,
            borderRadius: Radius.M,
          },
        ]}>
        <TabView
          tabs={[
            {label: 'Demo 1', icon: 'delete-outline'},
            {label: 'Demo 2', icon: 'home-outline'},
            {label: 'Demo 3', icon: 'bookmark-outline'},
          ]}
          direction={'row'}
          initialIndex={0}
        />
      </View>
      <SizedBox height={Spacing.M} />
      <View
        style={[
          Shadow.light,
          {
            backgroundColor: theme.colors.background.surface,
            padding: Spacing.M,
            borderRadius: Radius.M,
          },
        ]}>
        <TabView
          tabs={[{label: 'Demo 1'}, {label: 'Demo 2'}, {label: 'Demo 3'}]}
          direction={'row'}
          initialIndex={0}
        />
      </View>
      <SizedBox height={Spacing.M} />
      <View
        style={[
          Styles.flex,
          Shadow.light,
          {
            backgroundColor: theme.colors.background.surface,
            padding: Spacing.M,
            borderRadius: Radius.M,
          },
        ]}>
        <TabView
          ref={pagerRef}
          tabs={[
            {
              icon: 'delete-outline',
              content: (
                <View key="1" style={styles.pageContent}>
                  <Text>Page 1</Text>
                </View>
              ),
            },
            {
              icon: 'home-outline',
              content: (
                <View key="2" style={styles.pageContent}>
                  <Text>Page 2</Text>
                </View>
              ),
            },
            {
              icon: 'bookmark-outline',
              content: (
                <View key="2" style={styles.pageContent}>
                  <Text>Page 3</Text>
                </View>
              ),
            },
          ]}
          direction={'row'}
          initialIndex={0}
          onPressTabItem={(index: number) => {
            requestAnimationFrame(() => pagerRef.current?.setPage(index));
          }}
          style={Styles.flex}
          contentStyles={Styles.flex}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
  pageContent: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});

export default TabBarUsage;
