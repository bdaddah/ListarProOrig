import React, {useContext, useRef, useState} from 'react';
import {
  ApplicationContext,
  Button,
  Input,
  InputRef,
  Screen,
  ScreenContainerProps,
  SizedBox,
  Spacing,
  Styles,
} from '@passionui/components';
import {validate} from '@utils';

const Social: React.FC<ScreenContainerProps> = ({
  navigation,
  item,
  onChange,
}) => {
  const {translate, navigator, theme} = useContext(ApplicationContext);
  const twitterRef = useRef<InputRef>();
  const instagramRef = useRef<InputRef>();
  const googleRef = useRef<InputRef>();
  const linkedInRef = useRef<InputRef>();
  const youtubeRef = useRef<InputRef>();
  const tumblrRef = useRef<InputRef>();
  const flickrRef = useRef<InputRef>();
  const pinterestRef = useRef<InputRef>();

  const facebook = useRef(item?.facebook ?? '');
  const twitter = useRef(item?.twitter ?? '');
  const instagram = useRef(item?.instagram ?? '');
  const google = useRef(item?.google ?? '');
  const linkedIn = useRef(item?.linkedIn ?? '');
  const youtube = useRef(item?.youtube ?? '');
  const tumblr = useRef(item?.tumblr ?? '');
  const flickr = useRef(item?.flickr ?? '');
  const pinterest = useRef(item?.pinterest ?? '');
  const [error, setError] = useState<any>({});

  /**
   * on apply
   */
  const onApply = () => {
    onChange({
      facebook,
      twitter,
      instagram,
      google_plus: google,
      linkedIn,
      youtube,
      tumblr,
      flickr,
      pinterest,
    });
    navigator?.pop();
  };

  return (
    <Screen
      navigation={navigation}
      scrollable={true}
      enableKeyboardAvoidingView={true}
      scrollViewProps={{
        contentContainerStyle: [
          Styles.paddingM,
          {backgroundColor: theme.colors.background.surface},
        ],
      }}
      options={{title: translate('social_network')}}
      footerComponent={
        <Button
          title={translate('apply')}
          onPress={onApply}
          type={
            Object.values(error).some(i => i !== undefined)
              ? 'disabled'
              : 'primary'
          }
        />
      }>
      <Input
        defaultValue={facebook.current}
        floatingValue={translate('facebook')}
        placeholder={translate('input_facebook')}
        onChangeText={value => {
          const valid = validate(value, {website: true});
          facebook.current = value;
          setError({...error, facebook: valid});
        }}
        onFocus={() => {
          setError({...error, facebook: undefined});
        }}
        onEndEditing={() => twitterRef.current?.focus()}
        error={translate(error?.facebook)}
      />
      <SizedBox height={Spacing.M} />
      <Input
        ref={twitterRef}
        defaultValue={twitter.current}
        floatingValue={translate('twitter')}
        placeholder={translate('input_twitter')}
        onChangeText={value => {
          const valid = validate(value, {website: true});
          twitter.current = value;
          setError({...error, twitter: valid});
        }}
        onFocus={() => {
          setError({...error, twitter: undefined});
        }}
        onEndEditing={() => instagramRef.current?.focus()}
        error={translate(error?.twitter)}
      />
      <SizedBox height={Spacing.M} />
      <Input
        ref={instagramRef}
        defaultValue={instagram.current}
        floatingValue={translate('instagram')}
        placeholder={translate('input_instagram')}
        onChangeText={value => {
          const valid = validate(value, {website: true});
          instagram.current = value;
          setError({...error, instagram: valid});
        }}
        onFocus={() => {
          setError({...error, instagram: undefined});
        }}
        onEndEditing={() => googleRef.current?.focus()}
        error={translate(error?.instagram)}
      />
      <SizedBox height={Spacing.M} />
      <Input
        ref={googleRef}
        defaultValue={google.current}
        floatingValue={translate('google')}
        placeholder={translate('input_google')}
        onChangeText={value => {
          const valid = validate(value, {website: true});
          google.current = value;
          setError({...error, google: valid});
        }}
        onFocus={() => {
          setError({...error, google: undefined});
        }}
        onEndEditing={() => linkedInRef.current?.focus()}
        error={translate(error?.google)}
      />
      <SizedBox height={Spacing.M} />
      <Input
        ref={linkedInRef}
        defaultValue={linkedIn.current}
        floatingValue={translate('linkedin')}
        placeholder={translate('input_linkedin')}
        onChangeText={value => {
          const valid = validate(value, {website: true});
          linkedIn.current = value;
          setError({...error, linkedIn: valid});
        }}
        onFocus={() => {
          setError({...error, linkedIn: undefined});
        }}
        onEndEditing={() => youtubeRef.current?.focus()}
        error={translate(error?.linkedIn)}
      />
      <SizedBox height={Spacing.M} />
      <Input
        ref={youtubeRef}
        defaultValue={youtube.current}
        floatingValue={translate('youtube')}
        placeholder={translate('input_youtube')}
        onChangeText={value => {
          const valid = validate(value, {website: true});
          youtube.current = value;
          setError({...error, youtube: valid});
        }}
        onFocus={() => {
          setError({...error, youtube: undefined});
        }}
        onEndEditing={() => tumblrRef.current?.focus()}
        error={translate(error?.youtube)}
      />
      <SizedBox height={Spacing.M} />
      <Input
        ref={tumblrRef}
        defaultValue={tumblr.current}
        floatingValue={translate('tumblr')}
        placeholder={translate('input_tumblr')}
        onChangeText={value => {
          const valid = validate(value, {website: true});
          tumblr.current = value;
          setError({...error, tumblr: valid});
        }}
        onFocus={() => {
          setError({...error, tumblr: undefined});
        }}
        onEndEditing={() => tumblrRef.current?.focus()}
        error={translate(error?.tumblr)}
      />
      <SizedBox height={Spacing.M} />
      <Input
        ref={flickrRef}
        defaultValue={flickr.current}
        floatingValue={translate('flickr')}
        placeholder={translate('input_flickr')}
        onChangeText={value => {
          const valid = validate(value, {website: true});
          flickr.current = value;
          setError({...error, flickr: valid});
        }}
        onFocus={() => {
          setError({...error, flickr: undefined});
        }}
        onEndEditing={() => pinterestRef.current?.focus()}
        error={translate(error?.flickr)}
      />
      <SizedBox height={Spacing.M} />
      <Input
        ref={pinterestRef}
        defaultValue={pinterest.current}
        floatingValue={translate('pinterest')}
        placeholder={translate('input_pinterest')}
        onChangeText={value => {
          const valid = validate(value, {website: true});
          pinterest.current = value;
          setError({...error, pinterest: valid});
        }}
        onFocus={() => {
          setError({...error, pinterest: undefined});
        }}
        onEndEditing={() => pinterestRef.current?.focus()}
        error={translate(error?.pinterest)}
      />
    </Screen>
  );
};

export {Social};
