import React from 'react';
import {StyleProp, View, ViewStyle, ImageSourcePropType} from 'react-native';
import styles from './styles';
import {Button, Image, SizedBox, Spacing, Text} from '@passionui/components';

type EmptyAction = {
  title: string;
  onPress: () => void;
};

type EmptyProps = {
  style?: StyleProp<ViewStyle>;
  image?: ImageSourcePropType;
  title: string;
  message: string;
  action?: EmptyAction;
};

const Empty: React.FC<EmptyProps> = ({
  style,
  image,
  title,
  message,
  action,
}) => {
  /**
   * render for button
   */
  const renderAction = () => {
    if (action) {
      return (
        <>
          <SizedBox height={Spacing.M} />
          <Button
            size="medium"
            onPress={action.onPress}
            full={false}
            type="outline"
            title={action.title}
          />
        </>
      );
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Image style={styles.image} source={image} />
      <Text typography="subhead" fontWeight="bold">
        {title}
      </Text>
      <SizedBox height={Spacing.XS} />
      <Text typography="caption1">{message}</Text>
      {renderAction()}
    </View>
  );
};

export {Empty};
