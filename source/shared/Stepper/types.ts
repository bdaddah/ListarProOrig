import {ViewProps} from 'react-native';

export interface StepperProps extends ViewProps {
  defaultValue: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
}
