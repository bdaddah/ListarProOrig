import React, {useContext} from 'react';
import {View} from 'react-native';
import {AdmobWidgetModel} from '@models+types';
import {
  ApplicationContext,
  SizedBox,
  Skeleton,
  Spacing,
  Styles,
  Text,
} from '@passionui/components';
import styles from './styles';

const AdmobWidget: React.FC<AdmobWidgetModel> = widget => {
  const {theme} = useContext(ApplicationContext);
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
      <Skeleton style={styles.loading} />
    </View>
  );
};

export {AdmobWidget};
