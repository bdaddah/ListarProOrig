import {ViewProps} from 'react-native';

export interface DividerProps extends ViewProps {
  size?: number;
  type?: 'line' | 'dash';
  dashSpecs?: {
    dashGap?: number;
    useDot: boolean;
    dotColor?: string;
  };
  direction?: 'vertical' | 'horizontal';
  color?: string;
}
