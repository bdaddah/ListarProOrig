import {TextProps} from 'react-native';

export interface LoopTextProps extends TextProps {
  labels: string[];
  delay?: number;
  duration?: number;
}
