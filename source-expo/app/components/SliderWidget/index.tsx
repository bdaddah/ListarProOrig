import React, {useContext, useRef} from 'react';
import {Linking, View} from 'react-native';
import {SliderWidgetModel} from '@models+types';
import {
  ApplicationContext,
  SizedBox,
  Spacing,
  Styles,
  Text,
} from '@passionui/components';
import {ImageSlider} from '@components';
import styles from './styles';

const SliderWidget: React.FC<SliderWidgetModel> = widget => {
  const {theme, navigator} = useContext(ApplicationContext);
  const index = useRef<number>(0);

  /**
   * on open link
   */
  const onAction = () => {
    const url = widget.items?.[index.current].link;
    Linking.openURL(url).catch(e => {
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
      <ImageSlider
        style={styles.container}
        data={widget.items?.map(item => item.image)}
        onChange={(i: number) => (index.current = i)}
        position={Spacing.S}
        onPress={onAction}
      />
    </View>
  );
};

export {SliderWidget};
