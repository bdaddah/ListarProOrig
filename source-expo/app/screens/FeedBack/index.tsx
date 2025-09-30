import React, {useContext, useRef, useState} from 'react';
import {
  ApplicationContext,
  Button,
  Image,
  InputTextArea,
  Screen,
  ScreenContainerProps,
  SizedBox,
  Spacing,
  Styles,
  Text,
} from '@passionui/components';

import {View} from 'react-native';
import {ProductModel} from '@models+types';
import {Rating} from '@components';
import {validate} from '@utils';
import styles from './styles';
import {reviewActions} from '@redux';

const FeedBack: React.FC<ScreenContainerProps> = ({navigation, ...props}) => {
  const product: ProductModel = props.item;
  const {theme, navigator, translate} = useContext(ApplicationContext);
  const description = useRef('');
  const rate = useRef(product.rate);
  const [error, setError] = useState<any>();

  /**
   * on submit
   */
  const onSubmit = () => {
    reviewActions.onAdd(
      {
        post: product.id,
        content: description.current,
        rating: rate.current,
      },
      () => {
        navigator?.pop();
        props.reload?.();
      },
    );
  };

  /**
   * on change
   * @param text
   */
  const onChange = (text: string) => {
    description.current = text;
    const valid = validate(text, {empty: false});
    setError(valid);
  };

  return (
    <Screen
      navigation={navigation}
      enableKeyboardAvoidingView={true}
      options={{title: translate('feedback')}}
      backgroundColor={theme.colors.background.surface}
      style={Styles.paddingM}
      footerComponent={<Button onPress={onSubmit} title={translate('send')} />}>
      <View style={Styles.columnCenter}>
        <Image source={{uri: product.author?.image}} style={styles.avatar} />
        <SizedBox height={Spacing.S} />
        <Rating
          rate={product.rate}
          size={20}
          onFinishRating={value => (rate.current = value)}
        />
        <SizedBox height={Spacing.XS} />
        <Text typography={'footnote'}>{translate('tap_rate')}</Text>
      </View>
      <SizedBox height={Spacing.XL} />
      <InputTextArea
        floatingValue={translate('description')}
        placeholder={translate('input_description')}
        onChangeText={onChange}
        style={styles.textarea}
        onBlur={() => onChange(description.current)}
        error={translate(error)}
      />
    </Screen>
  );
};

export {FeedBack};
