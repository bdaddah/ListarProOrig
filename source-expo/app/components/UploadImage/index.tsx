import React, {useContext, useRef, useState} from 'react';
import {Pressable, StyleProp, View, ViewStyle} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {
  ImagePickerAsset,
  ImagePickerOptions,
  MediaTypeOptions,
} from 'expo-image-picker/src/ImagePicker.types';
import {ApplicationContext, Icon, Image} from '@passionui/components';
import styles from './styles';
import {Bar, CircleSnail} from 'react-native-progress';
import Api from '@api';
import {ImageModel} from '@models+types';

interface ImagePickerProps {
  style?: StyleProp<ViewStyle>;
  image?: string;
  type: 'photo' | 'camera';
  progress?: 'circle' | 'line';
  onResult?: (data: ImageModel) => void;
  onPress?: () => void;
}

const ImageUpload: React.FC<ImagePickerProps> = ({
  style,
  image,
  type = 'photo',
  progress = 'circle',
  onResult,
  onPress,
}) => {
  const {theme} = useContext(ApplicationContext);
  const [asset, setAsset] = useState<ImagePickerAsset>();
  const [percent, setPercent] = useState(0);
  const size = useRef(0);
  const widthLine = useRef(0);

  /**
   * on picker image
   */
  const onPicker = async () => {
    const options: ImagePickerOptions = {
      quality: 1,
      mediaTypes: MediaTypeOptions.Images,
    };
    let result;
    if (type === 'photo') {
      result = await ImagePicker.launchImageLibraryAsync(options);
    } else {
      result = await ImagePicker.launchCameraAsync(options);
    }
    const picked = result?.assets?.[0];
    if (picked) {
      setAsset(picked);
      setPercent(0);
      const formData = new FormData();
      formData.append('file', {
        name: picked.fileName,
        uri: picked.uri,
        fileSize: picked.fileSize,
        type: picked.type,
      } as any);

      try {
        const response = await Api.http.uploadMedia({
          params: formData,
          onProgress: setPercent,
        });
        const data = ImageModel.fromJsonUpload(response);
        if (data) {
          onResult?.(data);
        }
        setPercent(0);
      } catch (error: any) {
        Api.navigator?.showToast({
          message: error?.response?.data?.message ?? error?.message,
          type: 'warning',
        });
      }
    }
  };

  /**
   * render loading content
   */
  const renderLoading = () => {
    if (percent && percent > 0 && percent < 100) {
      if (progress === 'line') {
        return (
          <View style={styles.uploadProcessingLine}>
            <Bar
              progress={percent / 100}
              width={widthLine.current}
              color={theme.colors.primary.default}
              style={styles.line}
              onLayout={e => {
                widthLine.current = e.nativeEvent.layout.width;
              }}
            />
          </View>
        );
      }
      return (
        <View style={styles.uploadProcessing}>
          <CircleSnail
            progress={percent / 100}
            size={size.current}
            color={theme.colors.primary.default}
          />
        </View>
      );
    }

    if (percent === 100) {
      if (progress === 'line') {
        return (
          <View style={styles.uploadProcessingLine}>
            <Bar
              width={widthLine.current}
              indeterminate={true}
              color={theme.colors.primary.default}
              useNativeDriver={true}
              style={styles.line}
            />
          </View>
        );
      }
      return (
        <View style={styles.uploadProcessing}>
          <CircleSnail
            indeterminate={true}
            size={size.current}
            color={theme.colors.primary.default}
          />
        </View>
      );
    }
  };

  /**
   * render for content
   */
  const renderContent = () => {
    const source = asset?.uri ?? image;

    return (
      <View
        style={[
          styles.container,
          {borderColor: theme.colors.primary.default},
          style,
        ]}
        onLayout={event => (size.current = event.nativeEvent.layout.width)}>
        {source ? (
          <Image source={{uri: source}} style={[style, styles.image]} />
        ) : (
          <Icon
            name="cloud-upload-outline"
            color={theme.colors.primary.default}
          />
        )}
      </View>
    );
  };

  return (
    <Pressable onPress={onPress ?? onPicker} style={style}>
      {renderContent()}
      {renderLoading()}
    </Pressable>
  );
};

export {ImageUpload};
