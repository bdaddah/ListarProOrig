import {
  ApplicationContext,
  Button,
  CheckBox,
  Container,
  Input,
  Item,
  Popup,
  PopupProps,
  Radius,
  Screen,
  ScreenContainerProps,
  Spacing,
  Styles,
} from '@passionui/components';
import React, {useContext, useState} from 'react';
import {StyleSheet} from 'react-native';

const DEFAULT_NOTIFY: PopupProps = {
  image: 'https://i.imgur.com/s70S9s9.png',
  title: 'Notice',
  description: 'OTP for register wallet will be send to your phone number.',
  buttonDirection: 'auto',
  primary: {
    title: 'Primary',
    onPress: () => {},
  },
  secondary: {
    title: 'Secondary',
    onPress: () => {},
  },
};

const PopupUsage: React.FC<ScreenContainerProps> = ({navigation}) => {
  const {navigator, theme} = useContext(ApplicationContext);
  const [notify, setNotify] = useState<PopupProps>(DEFAULT_NOTIFY);
  const [barrierDismissible, setBarrierDismissible] = useState(false);

  /**
   * on show popup
   */
  const onShowPopup = () => {
    navigator?.showModal({
      screen: () => <Popup {...notify} />,
      barrierDismissible,
      onDismiss: () => {},
    });
  };

  return (
    <Screen
      navigation={navigation}
      options={{title: 'Popup'}}
      scrollable={true}
      footerComponent={<Button title={'Show Popup'} onPress={onShowPopup} />}
      style={Styles.paddingVerticalM}>
      <Container
        padding={12}
        gutter={12}
        style={[
          styles.card,
          {backgroundColor: theme.colors.background.surface},
        ]}>
        <Item widthSpan={12}>
          <CheckBox
            label="barrierDismissible"
            value={barrierDismissible}
            onChange={value => {
              setBarrierDismissible(value);
            }}
          />
        </Item>
        <Item widthSpan={12}>
          <Input
            defaultValue={notify.image}
            placeholder={'Input image url'}
            floatingValue={'image'}
            onChangeText={value => {
              setNotify({...notify, image: value});
            }}
          />
        </Item>
        <Item widthSpan={12}>
          <CheckBox
            onChange={value => {
              setNotify({
                ...notify,
                image: value ? undefined : DEFAULT_NOTIFY.image,
              });
            }}
            value={notify.image === undefined}
            label="undefined"
          />
        </Item>
        <Item widthSpan={12}>
          <Input
            defaultValue={notify.title}
            placeholder={'Input title'}
            floatingValue={'title'}
            onChangeText={value => {
              setNotify({...notify, title: value});
            }}
          />
        </Item>
        <Item widthSpan={12}>
          <Input
            defaultValue={notify.description as string}
            placeholder={'Input description'}
            floatingValue={'description'}
            onChangeText={value => {
              setNotify({...notify, description: value});
            }}
          />
        </Item>
        <Item widthSpan={12}>
          <Input
            defaultValue={notify.information}
            placeholder={'Input information'}
            floatingValue={'information'}
            onChangeText={value => {
              setNotify({...notify, information: value});
            }}
          />
        </Item>
        <Item widthSpan={12}>
          <CheckBox
            onChange={value => {
              setNotify({
                ...notify,
                information: value ? undefined : DEFAULT_NOTIFY.information,
              });
            }}
            value={notify.information === undefined}
            label="undefined"
          />
        </Item>
        <Item widthSpan={12}>
          <Input
            defaultValue={notify.buttonDirection}
            placeholder={'Input buttonDirection'}
            floatingValue={'buttonDirection'}
            onChangeText={(value: any) => {
              setNotify({...notify, buttonDirection: value});
            }}
          />
        </Item>
        <Item widthSpan={12}>
          <Input
            defaultValue={notify.primary.title}
            placeholder={'Input primary.title'}
            floatingValue={'primary.title'}
            onChangeText={value => {
              setNotify({
                ...notify,
                primary: {
                  ...notify.primary,
                  title: value,
                },
              });
            }}
          />
        </Item>
        <Item widthSpan={12}>
          <Input
            defaultValue={notify.secondary?.title}
            placeholder={'Input secondary.title'}
            floatingValue={'secondary.title'}
            onChangeText={(value: any) => {
              setNotify({
                ...notify,
                secondary: {
                  onPress: () => {},
                  title: value,
                },
              });
            }}
          />
        </Item>
        <Item widthSpan={12}>
          <CheckBox
            onChange={value => {
              setNotify({
                ...notify,
                secondary: value ? undefined : DEFAULT_NOTIFY.secondary,
              });
            }}
            value={notify.secondary === undefined}
            label="undefined"
          />
        </Item>
      </Container>
    </Screen>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.M,
    padding: Spacing.M,
  },
});

export default PopupUsage;
