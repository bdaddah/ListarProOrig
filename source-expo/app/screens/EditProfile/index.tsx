import React, {useContext, useRef, useState} from 'react';

import {Keyboard, View} from 'react-native';
import {validate} from '@utils';
import {useSelector} from 'react-redux';
import {
  ApplicationContext,
  Button,
  Input,
  InputTextArea,
  Screen,
  ScreenContainerProps,
  SizedBox,
  Spacing,
  Styles,
  InputRef,
  Shadow,
  Radius,
} from '@passionui/components';
import {authenticationActions, userSelect} from '@redux';
import {ImageUpload} from '@components';
import styles from './styles';
import {ImageModel} from '@models+types';

const EditProfile: React.FC<ScreenContainerProps> = ({navigation}) => {
  const {theme, navigator, translate} = useContext(ApplicationContext);

  const user = useSelector(userSelect);
  const avatar = useRef<ImageModel>();
  const nameRef = useRef<InputRef>();
  const emailRef = useRef<InputRef>();
  const websiteRef = useRef<InputRef>();
  const infoRef = useRef<InputRef>();
  const name = useRef(user?.name);
  const email = useRef(user?.email);
  const website = useRef(user?.url);
  const info = useRef(user?.description);

  const [error, setError] = useState<any>({
    name: null,
    email: null,
    website: null,
    info: null,
  });

  const onChangeName = (value: string) => {
    const valid = validate(value, {empty: false});
    name.current = value;
    setError({...error, name: valid});
  };

  const onChangeEmail = (value: string) => {
    const valid = validate(value, {empty: false, email: true});
    email.current = value;
    setError({...error, email: valid});
  };

  const onChangeWebsite = (value: string) => {
    const valid = validate(value, {empty: false});
    website.current = value;
    setError({...error, website: valid});
  };

  const onChangeInfo = (value: string) => {
    const valid = validate(value, {empty: false});
    info.current = value;
    setError({...error, info: valid});
  };

  /**
   * on next
   */
  const onSubmit = () => {
    Keyboard.dismiss();
    const params = {
      name: name.current,
      email: email.current,
      url: website.current,
      description: info.current,
      listar_user_photo: avatar.current?.id,
    };
    authenticationActions.onEditProfile(params, () => {
      navigator?.pop();
    });
  };

  /**
   * check disable next step
   */
  const disableNext = () => {
    const validName = validate(name.current, {empty: false});
    const validEmail = validate(email.current, {empty: false, email: true});
    const validWebsite = validate(website.current, {empty: false});

    return !!(validName || validEmail || validWebsite);
  };

  return (
    <Screen
      navigation={navigation}
      enableKeyboardAvoidingView={true}
      options={{title: translate('edit_profile')}}
      scrollable={true}
      style={Styles.paddingM}
      footerComponent={
        <Button
          onPress={onSubmit}
          type={disableNext() ? 'disabled' : 'primary'}
          title={translate('update')}
        />
      }>
      <View
        style={[
          Shadow.light,
          {
            backgroundColor: theme.colors.background.surface,
            padding: Spacing.M,
            borderRadius: Radius.M,
          },
        ]}>
        <View style={Styles.rowCenter}>
          <ImageUpload
            progress={'circle'}
            image={user?.image}
            style={styles.avatar}
            type={'photo'}
            onResult={data => (avatar.current = data)}
          />
        </View>
        <SizedBox height={Spacing.M} />
        <Input
          ref={nameRef}
          defaultValue={name.current}
          floatingValue={translate('name')}
          placeholder={translate('input_name')}
          onChangeText={onChangeName}
          onFocus={() => {
            setError({...error, name: null});
          }}
          onBlur={() => onChangeName(name.current)}
          onSubmitEditing={() => emailRef.current?.focus()}
          error={translate(error.name)}
        />
        <SizedBox height={Spacing.M} />
        <Input
          ref={emailRef}
          defaultValue={email.current}
          floatingValue={translate('email')}
          placeholder={translate('input_email')}
          onChangeText={onChangeEmail}
          onFocus={() => {
            setError({...error, email: null});
          }}
          onBlur={() => onChangeEmail(email.current)}
          onSubmitEditing={() => websiteRef.current?.focus()}
          error={translate(error.email)}
        />
        <SizedBox height={Spacing.M} />
        <Input
          ref={websiteRef}
          defaultValue={website.current}
          floatingValue={translate('website')}
          placeholder={translate('input_website')}
          onChangeText={onChangeWebsite}
          onFocus={() => {
            setError({...error, website: null});
          }}
          onBlur={() => onChangeWebsite(website.current)}
          onSubmitEditing={() => infoRef.current?.focus()}
          error={translate(error.website)}
        />
        <SizedBox height={Spacing.M} />
        <InputTextArea
          ref={infoRef}
          defaultValue={info.current}
          floatingValue={translate('description')}
          placeholder={translate('input_information')}
          onChangeText={onChangeInfo}
          onFocus={() => {
            setError({...error, info: null});
          }}
          style={styles.textarea}
          onBlur={() => onChangeInfo(info.current)}
          error={translate(error.info)}
        />
      </View>
    </Screen>
  );
};

export {EditProfile};
