import React, {useContext} from 'react';
import {Text as RNText} from 'react-native';
import {
  ApplicationContext,
  FontWeight,
  TextProps,
  Theme,
  Typography,
} from '../index';
import styles from './styles';

const SFProText: Record<string, string> = {
  '100': 'Thin',
  '200': 'Ultralight',
  '300': 'Light',
  '400': 'Regular',
  '500': 'Medium',
  '600': 'Semibold',
  '700': 'Bold',
  '800': 'Heavy',
  '900': 'Black',
  normal: 'Regular',
  bold: 'Bold',
};

const Raleway: Record<string, string> = {
  '100': 'Thin',
  '200': 'ExtraLight',
  '300': 'Light',
  '400': 'Regular',
  '500': 'Medium',
  '600': 'SemiBold',
  '700': 'Bold',
  '800': 'ExtraBold',
  '900': 'Black',
  normal: 'Regular',
  bold: 'Bold',
};

const Poppins: Record<string, string> = {
  '100': 'Thin',
  '200': 'ExtraLight',
  '300': 'Light',
  '400': 'Regular',
  '500': 'Medium',
  '600': 'SemiBold',
  '700': 'Bold',
  '800': 'ExtraBold',
  '900': 'Black',
  normal: 'Regular',
  bold: 'Bold',
};

const FontStyle: {[key: string]: string} = {
  italic: 'Italic',
  normal: '',
};

const getTypoStyle = (
  theme: Theme,
  typo: Typography,
  fontWeight?: FontWeight,
) => {
  const typoStyle = styles[typo] ?? styles.body;
  const weightStyle = fontWeight ? styles[fontWeight] : {};
  const style: any = {...typoStyle, ...weightStyle};

  const {fontSize, fontStyle = 'normal', fontWeight: weight} = style;
  let fontFamily: string;

  switch (theme.font) {
    case 'SFProText': {
      fontFamily = `${theme.font}-${SFProText[weight]}${FontStyle[fontStyle]}`;
      break;
    }
    case 'Raleway': {
      fontFamily = `${theme.font}-${Raleway[weight]}${FontStyle[fontStyle]}`;
      break;
    }
    case 'Poppins': {
      fontFamily = `${theme.font}-${Poppins[weight]}${FontStyle[fontStyle]}`;
      break;
    }
    default: {
      fontFamily = `SFProText-${SFProText[weight]}${FontStyle[fontStyle]}`;
    }
  }

  return {
    fontFamily,
    fontSize,
    fontStyle,
    fontWeight: weight,
  };
};

const Text: React.FC<TextProps> = ({
  typography = 'subhead',
  fontWeight,
  color,
  children,
  style,
  ...rest
}) => {
  const {theme} = useContext(ApplicationContext);
  const textStyle = getTypoStyle(theme, typography, fontWeight);
  return (
    <RNText
      {...rest}
      style={[textStyle, {color: color ?? theme.colors.text.default}, style]}>
      {children ?? ''}
    </RNText>
  );
};

export {Text, getTypoStyle};
