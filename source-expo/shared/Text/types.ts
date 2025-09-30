import {TextProps as RNTextProps} from 'react-native';

export type FontWeight =
  | 'ultralight'
  | 'thin'
  | 'light'
  | 'regular'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'heavy'
  | 'black';

export type Typography =
  | 'largeTitle'
  | 'title1'
  | 'title2'
  | 'title3'
  | 'headline'
  | 'body'
  | 'callout'
  | 'subhead'
  | 'footnote'
  | 'caption1'
  | 'caption2';

export interface TextProps extends RNTextProps {
  /**
   * Represents the typography style applied to the Text component.
   * It defines the appearance of the text in terms of font size, weight, line height etc.
   */
  typography?: Typography;

  /**
   * Optional. Represents the color of the text in the Text component.
   * It can be any valid color string (e.g., hex, rgb, rgba, etc.).
   */
  color?: string;

  fontWeight?: FontWeight;
}
