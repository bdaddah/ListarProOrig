import {StyleProp, ViewStyle} from 'react-native';

export type RadioProps = {
  /**
   * `value`: Represents the value associated with the Radio component.
   * It is used to determine whether the Radio component is selected or not in comparison with the `groupValue`.
   */
  value: string;

  /**
   * `disabled`: Optional. If `true`, the user won't be able to interact with the Radio component.
   * Defaults to `false` if not provided.
   */
  disabled?: boolean;

  /**
   * `label`: Optional. Represents the text label displayed next to the Radio component.
   */
  label?: string;

  /**
   * `onChange`: A callback function that is called when the value of the Radio component changes.
   * It is triggered when the user interacts with the Radio component.
   */
  onChange?: (value: string) => void;

  /**
   * `groupValue`: Represents the value of the selected Radio component within a group of Radio components.
   * The Radio component for which `value` equals `groupValue` will be selected.
   */
  groupValue: string;

  /**
   * `style`: Optional. Used to apply custom styling to the Radio component.
   * Accepts an object of style properties.
   */
  style?: StyleProp<ViewStyle>;
};
