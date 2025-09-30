import {TouchableOpacityProps} from 'react-native';
import {ReactNode} from 'react';
import {LinearGradientProps} from 'react-native-linear-gradient';

export interface ButtonProps extends TouchableOpacityProps {
  /**
   * Defines the visual style of the button.
   */
  type?: 'primary' | 'tonal' | 'outline' | 'text' | 'disabled' | 'gradient';

  /**
   *  Defines the size of the button.
   */
  size?: 'large' | 'medium' | 'small';

  /**
   * Defines the color hex code of the button.
   */
  color?: string;

  /**
   * If true, the button will take the full width of its container.
   */
  full?: boolean;

  /**
   * If true, the button will have rounded corners.
   */
  round?: boolean;

  /**
   * If true, the button will show loading indicator at left icon.
   */
  loading?: boolean;

  /**
   * Specifies the name of the icon that should be placed on the right side of the button.
   */
  trailing?: string | ReactNode;

  /**
   *  Specifies the name of the icon that should be placed on the left side of the button.
   */
  leading?: string | ReactNode;

  /**
   * Represents the props for the linear gradient.
   */
  gradientProps?: LinearGradientProps;
  /**
   * Represents the text that will be displayed on the button.
   */
  title: string;

  /**
   *  A callback function that is called when the button is pressed.
   */
  onPress: () => void;
}
