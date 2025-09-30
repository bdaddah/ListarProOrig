import {ViewProps} from 'react-native';

export interface ProgressBarProps extends ViewProps {
  /**
   * Required. Percentage value to display on the progress bar.
   */
  percent: number;
}
