import React, {useContext, useMemo, useState} from 'react';
import {
  ApplicationContext,
  Button,
  Colors,
  ContainerList,
  Icon,
  Screen,
  ScreenContainerProps,
  Spacing,
  Styles,
} from '@passionui/components';
import {TouchableOpacity, View} from 'react-native';
import {ImageUpload} from '@components';
import styles from './styles';

const GalleryUpload: React.FC<ScreenContainerProps> = ({
  navigation,
  items,
  onChange,
}) => {
  const {translate, navigator, theme} = useContext(ApplicationContext);
  const [galleries, setGalleries] = useState(items);

  /**
   * on apply
   */
  const onApply = () => {
    navigator?.pop();
    onChange?.(galleries);
  };

  /**
   * on delete image
   * @param index
   */
  const onDelete = (index: number) => {
    galleries.splice(index, 1);
    setGalleries([...galleries]);
  };

  /**
   * render data for list
   */
  const data = useMemo(() => {
    if (galleries?.length > 0) {
      return [...galleries, ...[{}]];
    }
    return [{}];
  }, [galleries]);

  return (
    <Screen
      navigation={navigation}
      options={{
        title: translate('gallery'),
      }}
      footerComponent={
        <Button
          title={translate('apply')}
          onPress={onApply}
          type={galleries?.length > 0 ? 'primary' : 'disabled'}
        />
      }>
      <ContainerList
        padding={Spacing.M}
        widthSpan={3}
        heightSpan={3}
        data={data}
        renderItem={({item, index}) => {
          return (
            <View style={Styles.flex}>
              <ImageUpload
                progress={'line'}
                image={item?.thumb}
                style={styles.image}
                type={'photo'}
                onResult={result => {
                  if (galleries?.[index]) {
                    galleries[index] = result;
                    setGalleries([...galleries]);
                  } else {
                    setGalleries([...(galleries ?? []), result]);
                  }
                }}
              />
              {galleries?.[index] && (
                <TouchableOpacity
                  onPress={() => onDelete(index)}
                  style={[
                    styles.delete,
                    {backgroundColor: theme.colors.primary.default},
                  ]}>
                  <Icon name="close" color={Colors.white} size={16} />
                </TouchableOpacity>
              )}
            </View>
          );
        }}
        keyExtractor={(item, index) => `gallery${item?.id ?? index}`}
        style={Styles.flex}
      />
    </Screen>
  );
};

export {GalleryUpload};
