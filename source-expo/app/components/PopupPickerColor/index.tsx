import React, {useContext, useRef} from 'react';
import {
  ApplicationContext,
  Popup,
  SizedBox,
  Spacing,
  Styles,
} from '@passionui/components';
import ColorPicker, {
  HueSlider,
  OpacitySlider,
  Panel1,
  Preview,
} from 'reanimated-color-picker';
import {View} from 'react-native';
import styles from './styles';

type ColorPickerProps = {
  color: string;
  onResult: (color: string) => void;
};

const PopupPickerColor: React.FC<ColorPickerProps> = ({color, onResult}) => {
  const {theme, translate} = useContext(ApplicationContext);
  const selected = useRef(color);

  const onSelectColor = (colors: any) => {
    if (colors.hex) {
      selected.current = colors.hex;
    }
  };

  return (
    <Popup
      title={translate('select_color')}
      description={
        <ColorPicker
          value={color}
          sliderThickness={25}
          thumbSize={30}
          style={styles.container}
          onComplete={onSelectColor}>
          <SizedBox height={Spacing.M} />
          <Panel1 style={styles.panel} />
          <SizedBox height={Spacing.M} />
          <View style={Styles.row}>
            <Preview style={styles.previewStyle} hideInitialColor hideText />
            <SizedBox width={Spacing.M} />
            <View style={Styles.flex}>
              <HueSlider
                thumbShape="triangleDown"
                thumbColor={theme.colors.text.secondary}
              />
              <SizedBox height={16} />
              <OpacitySlider
                thumbShape="triangleUp"
                thumbColor={theme.colors.text.secondary}
              />
            </View>
          </View>
        </ColorPicker>
      }
      primary={{
        title: translate('apply'),
        onPress: () => onResult(selected.current),
      }}
      secondary={{
        title: translate('close'),
        onPress: () => {},
      }}
    />
  );
};

export {PopupPickerColor};
