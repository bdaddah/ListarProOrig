import React, {useContext} from 'react';
import {Linking, TouchableOpacity, View} from 'react-native';
import {BannerWidgetModel} from '@models+types';
import {
  ApplicationContext,
  Image,
  SizedBox,
  Spacing,
  Styles,
  Text,
} from '@passionui/components';
import styles from './styles';

const BannerWidget: React.FC<BannerWidgetModel> = widget => {
  const {theme, navigator} = useContext(ApplicationContext);

  /**
   * on open link
   */
  const onAction = () => {
    const url = widget.item?.link;
    Linking.openURL(url!).catch(e => {
      navigator?.showToast({message: e.message, type: 'warning'});
    });
  };

  return (
    <View>
      <View style={Styles.paddingHorizontalM}>
        {widget.title && (
          <Text typography="callout" fontWeight="bold">
            {widget.title}
          </Text>
        )}
        {widget.description && (
          <Text typography="caption1" color={theme.colors.text.secondary}>
            {widget.description}
          </Text>
        )}
        {widget.title || widget.description ? (
          <SizedBox height={Spacing.S} />
        ) : null}
      </View>
      <TouchableOpacity style={styles.container} onPress={onAction}>
        <Image source={{uri: widget.item?.image.full}} style={Styles.full} />
      </TouchableOpacity>
    </View>
  );
};

export {BannerWidget};
