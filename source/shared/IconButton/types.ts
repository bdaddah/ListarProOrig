import {TouchableOpacityProps} from 'react-native';

export interface IconButtonProps extends TouchableOpacityProps {
  /**
   * Represents the name or key of the icon to be displayed on the IconButton.
   * It is a required property.
   */
  icon: string;

  /**
   * Optional. Defines the visual style of the IconButton.
   */
  type?: 'primary' | 'tonal' | 'secondary' | 'outline' | 'disabled';

  /**
   * Optional. Defines the color of the IconButton.
   */
  color?: string;

  /**
   * Optional. Defines the size of the IconButton.
   */
  size?: 'large' | 'medium' | 'small';

  /**
   * Optional. Defines the size of the IconButton.
   */
  shape?: 'circle' | 'rounded';
}
