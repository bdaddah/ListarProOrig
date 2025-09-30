import React, {useContext} from 'react';
import {
  ApplicationContext,
  Button,
  Icon,
  Screen,
  ScreenContainerProps,
  SizedBox,
  Spacing,
  Styles,
  Text,
} from '@passionui/components';
import {View} from 'react-native';
import styles from './styles';
import {SubmitListing} from '@screens';

const SubmitResult: React.FC<ScreenContainerProps> = ({navigation}) => {
  const {navigator, translate, theme} = useContext(ApplicationContext);

  /**
   * on more action
   */
  const onAction = () => {
    navigator?.replace({screen: SubmitListing});
  };

  return (
    <Screen
      navigation={navigation}
      options={{title: translate('listing')}}
      footerComponent={
        <Button title={translate('add_more')} onPress={onAction} />
      }
      style={styles.container}>
      <View
        style={[
          styles.iconSuccess,
          {backgroundColor: theme.colors.primary.default},
        ]}>
        <Icon name="check" size={32} color="white" />
      </View>
      <SizedBox height={Spacing.M} />
      <Text typography="headline" fontWeight="bold">
        {translate('completed')}
      </Text>
      <SizedBox height={Spacing.S} />
      <Text typography="caption2" style={Styles.textCenter}>
        {translate('submit_success_message')}
      </Text>
    </Screen>
  );
};

export {SubmitResult};
