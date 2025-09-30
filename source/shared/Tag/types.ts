import {ViewProps} from 'react-native';

export interface TagProps extends ViewProps {
  /**
   * `label`: Represents the text label displayed on the Tag component.
   */
  label: string;

  /**
   * `size`: Optional. Defines the size of the Tag component.
   * Defaults to 'medium' if not provided.
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * `type`: Optional. Defines the type of the Tag component.
   */
  type?: 'default' | 'rating';

  /**
   * `icon`: Optional. Represents the name or key of the icon to be displayed in the Tag component.
   */
  icon?: string;

  /**
   * `color`: Optional. Defines the color style of the Tag component.
   */
  color?: string;
}
