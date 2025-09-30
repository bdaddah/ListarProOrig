import {
  ApplicationContext,
  Button,
  Container,
  IconButton,
  Input,
  Item,
  ContainerList,
  LoopText,
  Radius,
  Screen,
  ScreenContainerProps,
  SizedBox,
  Spacing,
  Styles,
  Text,
} from '@passionui/components';
import React, {useContext, useState} from 'react';
import {StyleSheet, View} from 'react-native';

const LoopTextUsage: React.FC<ScreenContainerProps> = ({navigation}) => {
  const {theme} = useContext(ApplicationContext);
  const [labels, setLabel] = useState<any>(['Hello!', 'Welcome!']);
  const [value, setValue] = useState('');

  /**
   * on show
   */
  const onShow = () => {
    setLabel([...labels, ...[value]]);
    setValue('');
  };

  return (
    <Screen
      navigation={navigation}
      options={{title: 'Popup'}}
      scrollable={true}
      footerComponent={<Button title={'Add Label'} onPress={onShow} />}
      style={Styles.paddingVerticalM}>
      <Container
        padding={12}
        style={[
          styles.card,
          {backgroundColor: theme.colors.background.surface},
        ]}>
        <LoopText labels={labels} />
      </Container>
      <SizedBox height={Spacing.M} />
      <ContainerList
        margin={Spacing.M}
        padding={Spacing.M}
        style={[
          styles.card,
          {backgroundColor: theme.colors.background.surface},
        ]}
        scrollEnabled={false}
        data={labels}
        widthSpan={12}
        ListFooterComponent={
          <Item>
            <SizedBox height={Spacing.M} />
            <Input
              placeholder={'Input label'}
              onChangeText={setValue}
              value={value}
            />
          </Item>
        }
        renderItem={({item}) => {
          return (
            <View style={Styles.rowCenter}>
              <View style={Styles.flex}>
                <Text typography={'footnote'} fontWeight={'medium'}>
                  {item}
                </Text>
              </View>
              <SizedBox width={Spacing.S} />
              <IconButton
                icon={'close'}
                size={'medium'}
                type={'tonal'}
                onPress={() => {
                  setLabel(labels.filter((i: string) => i !== item));
                }}
              />
            </View>
          );
        }}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.M,
    padding: Spacing.M,
  },
});

export default LoopTextUsage;
