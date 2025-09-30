import {StyleProp, ViewStyle} from 'react-native';

export type SwitchProps = {
  /**
   * `value`: Represents whether the Switch component is currently in the 'on' (`true`) or 'off' (`false`) state.
   */
  value: boolean;

  /**
   * `onChange`: A callback function that is called when the value of the Switch component changes.
   * It receives the new value of the Switch as a parameter.
   */
  onChange: (value: boolean) => void;

  /**
   * `disabled`: Optional. If `true`, the user won't be able to interact with the Switch component.
   * Defaults to `false` if not provided.
   */
  disabled?: boolean;

  /**
   * `style`: Optional. Used to apply custom styling to the Switch component.
   * Accepts an object of style properties.
   */
  style?: StyleProp<ViewStyle>;
};
