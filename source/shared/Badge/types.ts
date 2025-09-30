import {ViewProps} from 'react-native';

export interface BadgeProps extends ViewProps {
  /**
   * `label`: Represents the text label displayed on the Tag component.
   */
  label?: string;

  /**
   * `size`: Optional. Defines the size of the Tag component.
   * Defaults to 'medium' if not provided.
   */
  type?: 'default' | 'dot' | 'label';
}
