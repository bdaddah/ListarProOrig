import React, {useContext, useRef, useState} from 'react';
import {
  ApplicationContext,
  HeaderRightAction,
  IconButton,
  NavigationButton,
  Screen,
  ScreenContainerProps,
  Styles,
} from '@passionui/components';

import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {GPSModel} from '@models+types';
import {View} from 'react-native';
import styles from './styles';
import {getCurrentLocation} from '@utils';

const Location: React.FC<ScreenContainerProps> = ({
  navigation,
  item,
  onChange,
}) => {
  const {navigator, translate} = useContext(ApplicationContext);
  const mapRef = useRef<MapView>(null);
  const defaultDelta = {latitudeDelta: 0.0922, longitudeDelta: 0.0421};
  const [location, setLocation] = useState<GPSModel | undefined>(item);

  /**
   * on apply location
   */
  const onApply = () => {
    onChange?.(location);
    navigator?.pop();
  };

  /**
   * on press map
   * @param nativeEvent
   */
  const onPressMap = ({nativeEvent}: any) => {
    if (item?.editable) {
      const newLocation = new GPSModel({
        name: item?.name ?? 'Location',
        ...nativeEvent.coordinate,
      });
      setLocation(newLocation);
    }
  };

  /**
   * on current location
   */
  const onCurrentLocation = async () => {
    const result = await getCurrentLocation();
    if (result) {
      mapRef.current?.animateToRegion({...result, ...defaultDelta}, 500);
    }
  };

  return (
    <Screen
      navigation={navigation}
      options={{
        title: translate('location'),
        headerRight: props => (
          <HeaderRightAction {...props}>
            <NavigationButton icon={'check'} onPress={onApply} />
          </HeaderRightAction>
        ),
      }}>
      <MapView
        ref={mapRef}
        style={Styles.flex}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        onPress={onPressMap}
        initialRegion={{
          latitude: 10.8175689,
          longitude: 106.6539669,
          ...defaultDelta,
          ...location,
        }}>
        {location && <Marker coordinate={location} />}
      </MapView>
      <View style={styles.locationButton}>
        <IconButton icon={'map-marker'} onPress={onCurrentLocation} />
      </View>
    </Screen>
  );
};

export {Location};
