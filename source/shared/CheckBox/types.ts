import {StyleProp, ViewStyle} from 'react-native';

export type CheckBoxProps = {
  /**
   * Represents whether the CheckBox is currently checked (`true`) or unchecked (`false`).
   */
  value: boolean;

  /**
   *  Optional. If `true`, the user won't be able to interact with the CheckBox.
   * Defaults to `false` if not provided.
   */
  disabled?: boolean;

  /**
   *  Optional. Represents the text label displayed next to the CheckBox.
   */
  label?: string;

  /**
   *  A callback function that is called when the value of the CheckBox changes.
   * Receives the new value of the CheckBox as a parameter.
   */
  onChange: (value: boolean) => void;

  /**
   *  Optional. If `true`, the CheckBox will be in an indeterminate state,
   * which is typically used to represent a "mixed" or "partial" selection state.
   * Defaults to `false` if not provided.
   */
  indeterminate?: boolean;

  /**
   * Optional. Used to apply custom styling to the CheckBox component.
   * Accepts an object of style properties.
   */
  style?: StyleProp<ViewStyle>;
};
