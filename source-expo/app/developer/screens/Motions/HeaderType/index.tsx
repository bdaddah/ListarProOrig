import {
  ApplicationContext,
  Button,
  Input,
  InputDropDown,
  Screen,
  ScreenContainerProps,
  SheetPicker,
  SizedBox,
  Spacing,
} from '@passionui/components';
import React, {useContext, useState} from 'react';
import {StyleSheet, View} from 'react-native';

const STYLE = ['default', 'surface', 'extended', 'none'];
const HeaderType: React.FC<ScreenContainerProps> = ({navigation}) => {
  const {navigator, theme} = useContext(ApplicationContext);
  const [headerType, setHeaderType] = useState(STYLE[0]);
  const [title, setTitle] = useState('Title');

  return (
    <Screen
      navigation={navigation}
      scrollable={true}
      headerType={headerType as any}
      enableKeyboardAvoidingView={true}
      options={{
        title,
      }}
      scrollViewProps={{
        contentContainerStyle: {padding: Spacing.M},
        keyboardShouldPersistTaps: 'handled',
      }}
      footerComponent={<Button onPress={() => {}} title={'Button'} />}>
      <View
        style={[
          styles.screen,
          {
            backgroundColor: theme.colors.background.surface,
          },
        ]}>
        <InputDropDown
          value={headerType}
          floatingValue={'Header Type'}
          placeholder={'Select Header Type'}
          onPress={() => {
            navigator?.showBottomSheet({
              title: 'Select Options',
              screen: () => (
                <SheetPicker
                  data={STYLE.map(i => {
                    return {title: i, value: i};
                  })}
                  selected={{
                    title: headerType,
                    value: headerType,
                  }}
                  onSelect={index => {
                    navigator?.pop();
                    setHeaderType(STYLE[index]);
                  }}
                  renderItem={undefined}
                />
              ),
            });
          }}
        />
        <SizedBox height={12} />
        <Input
          defaultValue={title}
          floatingValue={'Input title'}
          placeholder={'Input title for header'}
          onChangeText={setTitle}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    width: '100%',
    height: 1000,
    borderRadius: Spacing.M,
    padding: Spacing.M,
  },
});

export default HeaderType;
