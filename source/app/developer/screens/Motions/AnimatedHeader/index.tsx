import {
  ApplicationContext,
  Button,
  HeaderBanner,
  Image,
  Input,
  Screen,
  ScreenContainerProps,
  SizedBox,
  Spacing,
  Styles,
  Switch,
  Text,
} from '@passionui/components';
import React, {useContext, useState} from 'react';
import {StyleSheet, View} from 'react-native';

const ExtendedHeader: React.FC<ScreenContainerProps> = ({navigation}) => {
  const {theme} = useContext(ApplicationContext);
  const [surface, setSurface] = useState(false);
  const [title, setTitle] = useState('Title');

  return (
    <Screen
      navigation={navigation}
      scrollable={true}
      enableKeyboardAvoidingView={true}
      options={{title}}
      scrollViewProps={{keyboardShouldPersistTaps: 'handled'}}
      footerComponent={<Button onPress={() => {}} title={'Button'} />}
      animatedHeader={{
        type: surface ? 'surface' : 'default',
        component: props => (
          <HeaderBanner {...props}>
            <Image
              style={Styles.flex}
              source={{
                uri: 'https://images.unsplash.com/photo-1509395062183-67c5ad6faff9',
              }}
            />
          </HeaderBanner>
        ),
      }}>
      <View
        style={[
          styles.screen,
          {
            backgroundColor: theme.colors.background.surface,
          },
        ]}>
        <View style={Styles.rowSpace}>
          <Text typography={'headline'} fontWeight="bold">
            Surface
          </Text>
          <Switch value={surface} onChange={() => setSurface(!surface)} />
        </View>
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
    padding: Spacing.M,
    borderRadius: Spacing.M,
  },
});

export default ExtendedHeader;
