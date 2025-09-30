import {TextInputProps} from 'react-native';
import {ReactNode} from 'react';

export interface InputRef {
  focus: () => void;
  blur: () => void;
  clear: () => void;
  setText: (value: string) => void;
}

export interface InputProps extends TextInputProps {
  /**
   *  Optional. Defines the size of the Input component.
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Optional. Represents the value for the floating title in the Input component.
   */
  floatingValue?: string;

  /**
   * Optional. Represents the name or key of the floating icon to be displayed in the Input component.
   */
  floatingIcon?: string;

  /**
   * Optional. Represents the error message to be displayed below the Input component when there is an error.
   */
  error?: string;

  /**
   * Optional. Represents the leading icon to be displayed in the Input component.
   */
  leading?: string | ReactNode;

  /**
   * Optional. Represents the name or key of the icon to be displayed in the Input component.
   */
  trailing?: string | ReactNode;

  /**
   * Optional. Represents the color of the icon in the Input component.
   */
  iconColor?: string;

  /**
   * Optional. If `true`, the user won't be able to interact with the Input component.
   * Defaults to `false` if not provided.
   */
  disabled?: boolean;

  /**
   * Optional. Represents the color of the floating icon in the Input component.
   */
  floatingIconColor?: string;

  /**
   * Optional. If `true`, the Input component is marked as required,
   * indicating that the user must provide a value before submitting a form.
   * Defaults to `false` if not provided.
   */
  required?: boolean;
}

export interface InputTextAreaProps extends TextInputProps {
  /**
   * Optional. Represents the value for the floating title in the Input component.
   */
  floatingValue?: string;

  /**
   * Optional. Represents the name or key of the floating icon to be displayed in the Input component.
   */
  floatingIcon?: string;

  /**
   * Optional. Represents the error message to be displayed below the Input component when there is an error.
   */
  error?: string;

  /**
   * Optional. If `true`, the user won't be able to interact with the Input component.
   * Defaults to `false` if not provided.
   */
  disabled?: boolean;

  /**
   * Optional. Represents the color of the floating icon in the Input component.
   */
  floatingIconColor?: string;

  /**
   * Optional. If `true`, the Input component is marked as required,
   * indicating that the user must provide a value before submitting a form.
   * Defaults to `false` if not provided.
   */
  required?: boolean;
}

export interface InputSearchProps extends TextInputProps {
  /**
   *  Optional. Defines the size of the Input component.
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Optional. Represents the name or key of the icon to be displayed in the Input component.
   */
  icon?: string | ReactNode;

  /**
   * Optional. Represents the color of the icon in the Input component.
   */
  iconColor?: string;

  /**
   * A callback function that is called when the icon is pressed.
   */
  onPressIcon?: () => void;

  /**
   * Optional. If `true`, the user won't be able to interact with the Input component.
   */
  useShadow?: boolean;
}

export interface InputMoneyProps extends InputProps {
  /**
   * Optional. Represents currency be displayed in the Input component.
   */
  currency?: string;
}

export interface InputDropDownProps extends TextInputProps {
  /**
   *  Optional. Defines the size of the Input component.
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Optional. Represents the value for the floating title in the InputDropDown component.
   */
  floatingValue?: string;

  /**
   * Optional. Represents the name or key of the floating icon to be displayed in the InputDropDown component.
   */
  floatingIcon?: string;

  /**
   * Optional. Represents the leading icon to be displayed in the InputDropDown component.
   */
  leading?: string | ReactNode;

  /**
   * Optional. Represents the error message to be displayed below the InputDropDown component when there is an error.
   */
  error?: string;

  /**
   * Optional. Represents the trailing icon to be displayed in the InputDropDown component.
   */
  trailing?: string | ReactNode;

  /**
   * Optional. If `true`, the user won't be able to interact with the InputDropDown component.
   * Defaults to `false` if not provided.
   */
  disabled?: boolean;

  /**
   * Optional. Represents the color of the floating icon in the InputDropDown component.
   */
  floatingIconColor?: string;

  /**
   * Optional. If `true`, the InputDropDown component is marked as required,
   * indicating that the user must provide a value before submitting a form.
   * Defaults to `false` if not provided.
   */
  required?: boolean;

  /**
   *  A callback function that is called when the InputDropDown is pressed.
   */
  onPress: () => void;
}

export type CaretProps = {
  /**
   * Optional. The index of the caret in the input field.
   * Represents the position where the caret is located.
   */
  index: number;

  /**
   * Optional. The total length of the input field in which the caret is present.
   * This dictates the maximum value of the 'index' property.
   */
  length: number;
};

export interface InputOTPProps
  extends Omit<TextInputProps, 'placeholder' | 'placeholderTextColor'> {
  /**
   * Optional. Defines the length of the OTP (One Time Password) input.
   */
  length?: number;

  /**
   * Optional. Defines the data type of the OTP input.
   * 'string' - The OTP input will be treated as a string.
   * 'number' - The OTP input will be treated as a number.
   */
  dataType?: 'string' | 'number';

  /**
   * Optional. Represents the value for the floating title in the Input component.
   */
  floatingValue?: string;

  /**
   * Optional. Represents the error message to be displayed below the Input component when there is an error.
   */
  error?: string;
}
