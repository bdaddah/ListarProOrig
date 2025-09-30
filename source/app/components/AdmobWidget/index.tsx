import React, {useContext, useState} from 'react';
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
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';
import styles from './styles';

const AdmobWidget: React.FC<AdmobWidgetModel> = widget => {
  const {theme} = useContext(ApplicationContext);
  const [loaded, setLoaded] = useState(false);
  return (
    <>
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
      <View>
        <BannerAd
          unitId={widget.id ?? TestIds.BANNER}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          onAdLoaded={() => setLoaded(true)}
        />
        {!loaded && <Skeleton style={styles.loading} />}
      </View>
    </>
  );
};

export {AdmobWidget};
