import {
  ApplicationContext,
  Container,
  ContainerList,
  Item,
  Radius,
  Screen,
  ScreenContainerProps,
  Shadow,
  SizedBox,
  Spacing,
  Styles,
  Text,
} from '@passionui/components';

import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';

const StylesGuide: React.FC<ScreenContainerProps> = ({navigation}) => {
  const {theme} = useContext(ApplicationContext);

  return (
    <Screen
      navigation={navigation}
      scrollable={true}
      scrollViewProps={{contentContainerStyle: Styles.paddingVerticalM}}>
      <ContainerList
        padding={Spacing.M}
        margin={Spacing.M}
        scrollEnabled={false}
        widthSpan={3}
        style={[
          Shadow.light,
          {
            borderRadius: Spacing.M,
            backgroundColor: theme.colors.background.surface,
          },
        ]}
        data={Object.keys(theme.colors.primary)}
        ListHeaderComponent={
          <Item>
            <Text typography={'headline'} fontWeight="bold">
              Primary
            </Text>
            <SizedBox height={Spacing.S} />
          </Item>
        }
        renderItem={({item}) => {
          const backgroundColor = (theme.colors.primary as any)[item];
          return (
            <View>
              <View
                style={[
                  styles.box,
                  {backgroundColor, borderColor: theme.colors.border.default},
                ]}
              />
              <Text typography={'caption1'} fontWeight={'medium'}>
                {item}
              </Text>
              <Text typography={'caption1'} fontWeight={'medium'}>
                {backgroundColor}
              </Text>
            </View>
          );
        }}
        keyExtractor={item => `primary${item}`}
      />
      <SizedBox height={Spacing.M} />
      <ContainerList
        padding={Spacing.M}
        margin={Spacing.M}
        scrollEnabled={false}
        widthSpan={3}
        style={[
          Shadow.light,
          {
            borderRadius: Spacing.M,
            backgroundColor: theme.colors.background.surface,
          },
        ]}
        data={Object.keys(theme.colors.secondary)}
        ListHeaderComponent={
          <Item>
            <Text typography={'headline'} fontWeight="bold">
              Secondary
            </Text>
            <SizedBox height={Spacing.S} />
          </Item>
        }
        renderItem={({item}) => {
          const backgroundColor = (theme.colors.secondary as any)[item];
          return (
            <View>
              <View
                style={[
                  styles.box,
                  {backgroundColor, borderColor: theme.colors.border.default},
                ]}
              />
              <Text typography={'caption1'} fontWeight={'medium'}>
                {item}
              </Text>
              <Text typography={'caption1'} fontWeight={'medium'}>
                {backgroundColor}
              </Text>
            </View>
          );
        }}
        keyExtractor={item => `primary${item}`}
      />
      <SizedBox height={Spacing.M} />
      <ContainerList
        padding={Spacing.M}
        margin={Spacing.M}
        scrollEnabled={false}
        widthSpan={3}
        style={[
          Shadow.light,
          {
            borderRadius: Spacing.M,
            backgroundColor: theme.colors.background.surface,
          },
        ]}
        data={Object.keys(theme.colors.background)}
        ListHeaderComponent={
          <Item>
            <Text typography={'headline'} fontWeight="bold">
              Background
            </Text>
            <SizedBox height={Spacing.S} />
          </Item>
        }
        renderItem={({item}) => {
          const backgroundColor = (theme.colors.background as any)[item];
          return (
            <View>
              <View
                style={[
                  styles.box,
                  {backgroundColor, borderColor: theme.colors.border.default},
                ]}
              />
              <Text typography={'caption1'} fontWeight={'medium'}>
                {item}
              </Text>
              <Text typography={'caption1'} fontWeight={'medium'}>
                {backgroundColor}
              </Text>
            </View>
          );
        }}
        keyExtractor={item => `primary${item}`}
      />
      <SizedBox height={Spacing.M} />
      <ContainerList
        padding={Spacing.M}
        margin={Spacing.M}
        scrollEnabled={false}
        widthSpan={3}
        style={[
          Shadow.light,
          {
            borderRadius: Spacing.M,
            backgroundColor: theme.colors.background.surface,
          },
        ]}
        data={Object.keys(theme.colors.text)}
        ListHeaderComponent={
          <Item>
            <Text typography={'headline'} fontWeight="bold">
              Text
            </Text>
            <SizedBox height={Spacing.S} />
          </Item>
        }
        renderItem={({item}) => {
          const backgroundColor = (theme.colors.text as any)[item];
          return (
            <View>
              <View
                style={[
                  styles.box,
                  {backgroundColor, borderColor: theme.colors.border.default},
                ]}
              />
              <Text typography={'caption1'} fontWeight={'medium'}>
                {item}
              </Text>
              <Text typography={'caption1'} fontWeight={'medium'}>
                {backgroundColor}
              </Text>
            </View>
          );
        }}
        keyExtractor={item => `primary${item}`}
      />
      <SizedBox height={Spacing.M} />
      <ContainerList
        padding={Spacing.M}
        margin={Spacing.M}
        scrollEnabled={false}
        widthSpan={3}
        style={[
          Shadow.light,
          {
            borderRadius: Spacing.M,
            backgroundColor: theme.colors.background.surface,
          },
        ]}
        data={Object.keys(theme.colors.border)}
        ListHeaderComponent={
          <Item>
            <Text typography={'headline'} fontWeight="bold">
              Border
            </Text>
            <SizedBox height={Spacing.S} />
          </Item>
        }
        renderItem={({item}) => {
          const backgroundColor = (theme.colors.border as any)[item];
          return (
            <View>
              <View
                style={[
                  styles.box,
                  {backgroundColor, borderColor: theme.colors.border.default},
                ]}
              />
              <Text typography={'caption1'} fontWeight={'medium'}>
                {item}
              </Text>
              <Text typography={'caption1'} fontWeight={'medium'}>
                {backgroundColor}
              </Text>
            </View>
          );
        }}
        keyExtractor={item => `primary${item}`}
      />
      <SizedBox height={Spacing.M} />
      <ContainerList
        padding={Spacing.M}
        margin={Spacing.M}
        scrollEnabled={false}
        widthSpan={3}
        style={[
          Shadow.light,
          {
            borderRadius: Spacing.M,
            backgroundColor: theme.colors.background.surface,
          },
        ]}
        data={Object.keys(theme.colors.success)}
        ListHeaderComponent={
          <Item>
            <Text typography={'headline'} fontWeight="bold">
              Success
            </Text>
            <SizedBox height={Spacing.S} />
          </Item>
        }
        renderItem={({item}) => {
          const backgroundColor = (theme.colors.success as any)[item];
          return (
            <View>
              <View
                style={[
                  styles.box,
                  {backgroundColor, borderColor: theme.colors.border.default},
                ]}
              />
              <Text typography={'caption1'} fontWeight={'medium'}>
                {item}
              </Text>
              <Text typography={'caption1'} fontWeight={'medium'}>
                {backgroundColor}
              </Text>
            </View>
          );
        }}
        keyExtractor={item => `primary${item}`}
      />
      <SizedBox height={Spacing.M} />
      <ContainerList
        padding={Spacing.M}
        margin={Spacing.M}
        scrollEnabled={false}
        widthSpan={3}
        style={[
          Shadow.light,
          {
            borderRadius: Spacing.M,
            backgroundColor: theme.colors.background.surface,
          },
        ]}
        data={Object.keys(theme.colors.warning)}
        ListHeaderComponent={
          <Item>
            <Text typography={'headline'} fontWeight="bold">
              Warning
            </Text>
            <SizedBox height={Spacing.S} />
          </Item>
        }
        renderItem={({item}) => {
          const backgroundColor = (theme.colors.warning as any)[item];
          return (
            <View>
              <View
                style={[
                  styles.box,
                  {backgroundColor, borderColor: theme.colors.border.default},
                ]}
              />
              <Text typography={'caption1'} fontWeight={'medium'}>
                {item}
              </Text>
              <Text typography={'caption1'} fontWeight={'medium'}>
                {backgroundColor}
              </Text>
            </View>
          );
        }}
        keyExtractor={item => `primary${item}`}
      />
      <SizedBox height={Spacing.M} />
      <ContainerList
        padding={Spacing.M}
        margin={Spacing.M}
        scrollEnabled={false}
        widthSpan={3}
        style={[
          Shadow.light,
          {
            borderRadius: Spacing.M,
            backgroundColor: theme.colors.background.surface,
          },
        ]}
        data={Object.keys(theme.colors.error)}
        ListHeaderComponent={
          <Item>
            <Text typography={'headline'} fontWeight="bold">
              Error
            </Text>
            <SizedBox height={Spacing.S} />
          </Item>
        }
        renderItem={({item}) => {
          const backgroundColor = (theme.colors.error as any)[item];
          return (
            <View>
              <View
                style={[
                  styles.box,
                  {backgroundColor, borderColor: theme.colors.border.default},
                ]}
              />
              <Text typography={'caption1'} fontWeight={'medium'}>
                {item}
              </Text>
              <Text typography={'caption1'} fontWeight={'medium'}>
                {backgroundColor}
              </Text>
            </View>
          );
        }}
        keyExtractor={item => `primary${item}`}
      />
      <SizedBox height={Spacing.M} />
      <Container
        padding={12}
        style={[
          Shadow.light,
          {
            borderRadius: Spacing.M,
            backgroundColor: theme.colors.background.surface,
          },
        ]}>
        <Item>
          <Text typography={'headline'} fontWeight="bold">
            Spacing
          </Text>
        </Item>
        <View style={Styles.row}>
          {Object.keys(Spacing).map(item => {
            return (
              <View key={item} style={Styles.columnCenter}>
                <View
                  style={[
                    styles.spacing,
                    {
                      width: (Spacing as any)[item],
                      backgroundColor: theme.colors.primary.default,
                    },
                  ]}
                />
                <Text typography={'caption1'} fontWeight={'medium'}>
                  {item}
                </Text>
              </View>
            );
          })}
        </View>
      </Container>
      <SizedBox height={Spacing.M} />
      <ContainerList
        padding={Spacing.M}
        margin={Spacing.M}
        scrollEnabled={false}
        widthSpan={3}
        style={[
          Shadow.light,
          {
            borderRadius: Spacing.M,
            backgroundColor: theme.colors.background.surface,
          },
        ]}
        data={Object.keys(Radius)}
        renderItem={({item}) => {
          const borderRadius = (Radius as any)[item];
          return (
            <>
              <View
                style={[
                  styles.box,
                  {
                    backgroundColor: theme.colors.primary.default,
                    borderRadius,
                    borderColor: theme.colors.border.default,
                  },
                ]}
              />
              <Text typography={'caption1'} fontWeight={'medium'}>
                {item}
              </Text>
            </>
          );
        }}
        ListHeaderComponent={
          <Item>
            <Text typography={'headline'} fontWeight="bold">
              Radius
            </Text>
            <SizedBox height={Spacing.S} />
          </Item>
        }
        keyExtractor={item => `radius${item}`}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  box: {
    height: 60,
    borderRadius: Radius.M,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
  },
  spacing: {
    height: 32,
    margin: Spacing.S,
  },
});
export default StylesGuide;
