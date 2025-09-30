import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputFocusEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ErrorView,
  FloatingView,
  getBorderColor,
  getFontStyle,
  getIconSize,
  getSizeStyle,
} from './common';
import {
  ApplicationContext,
  Icon,
  InputProps,
  SizedBox,
  Spacing,
  Styles,
} from '../index';
import styles from './styles';

const Input = forwardRef(
  (
    {
      onChangeText,
      floatingValue,
      floatingIcon,
      size = 'small',
      onBlur,
      onFocus,
      error,
      leading,
      trailing,
      disabled,
      floatingIconColor,
      iconColor,
      required,
      style,
      ...props
    }: InputProps,
    ref,
  ) => {
    const {theme} = useContext(ApplicationContext);
    const inputRef = useRef<TextInput>(null);
    const [focused, setFocused] = useState(false);
    const [secureTextEntry, setSecureTextEntry] = useState(
      props.secureTextEntry,
    );

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef?.current?.focus();
      },
      blur: () => {
        inputRef?.current?.blur();
      },
      clear: () => onClearText,
      setText: (value: string) => {
        inputRef?.current?.setNativeProps({text: value});
        onChangeText?.(value);
      },
    }));

    const onClearText = () => {
      inputRef?.current?.clear();
      onChangeText?.('');
    };

    const _onFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setFocused(true);
      onFocus?.(e);
    };

    const _onBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setFocused(false);
      onBlur?.(e);
    };

    const renderLeadingIcon = () => {
      const disabledColor = theme.colors.text.disable;
      const iconSize = getIconSize(size);
      let iconTintColor = iconColor;
      if (disabled) {
        iconTintColor = disabledColor;
      }
      if (leading) {
        return (
          <View style={Styles.row}>
            <SizedBox width={Spacing.M} />
            {typeof leading === 'string' ? (
              <Icon color={iconTintColor} name={leading} size={iconSize} />
            ) : (
              leading
            )}
          </View>
        );
      }
    };

    /**
     * Renders the trailing icon in the Input component.
     */
    const renderTrailingIcon = () => {
      const disabledColor = theme.colors.text.disable;
      const iconSize = getIconSize(size);
      let iconTintColor = iconColor;
      if (disabled) {
        iconTintColor = disabledColor;
      }
      if (props.secureTextEntry) {
        return (
          <>
            <SizedBox width={Spacing.S} />
            <TouchableOpacity
              onPress={() => setSecureTextEntry(!secureTextEntry)}>
              <Icon
                color={iconTintColor}
                name={secureTextEntry ? 'eye-outline' : 'eye-off-outline'}
                size={iconSize}
              />
            </TouchableOpacity>
          </>
        );
      }

      if (trailing) {
        return (
          <>
            <SizedBox width={Spacing.S} />
            {typeof trailing === 'string' ? (
              <Icon color={iconTintColor} name={trailing} size={iconSize} />
            ) : (
              trailing
            )}
          </>
        );
      }
    };

    const renderInputView = () => {
      const disabledColor = theme.colors.text.disable;
      const iconSize = getIconSize(size);
      let textColor = theme.colors.text.default;
      let placeholderColor = theme.colors.text.hint;
      if (disabled) {
        textColor = disabledColor;
        placeholderColor = disabledColor;
      }

      return (
        <View
          style={[
            styles.inputWrapper,
            {
              backgroundColor: theme.colors.background.surface,
            },
            !!floatingValue && {marginTop: Spacing.S},
            getSizeStyle(size),
            getBorderColor(theme, focused, error, disabled),
          ]}>
          <FloatingView
            floatingValue={floatingValue}
            floatingIconColor={floatingIconColor}
            disabled={disabled}
            required={required}
            floatingIcon={floatingIcon}
          />
          {renderLeadingIcon()}
          <View style={styles.inputView}>
            <TextInput
              ref={inputRef}
              {...props}
              editable={!disabled}
              textAlignVertical="center"
              style={[
                styles.input,
                getFontStyle(theme, size),
                {color: textColor, lineHeight: undefined},
                style,
              ]}
              textContentType="oneTimeCode"
              secureTextEntry={props.secureTextEntry && secureTextEntry}
              textBreakStrategy="highQuality"
              onChangeText={onChangeText}
              onFocus={_onFocus}
              onBlur={_onBlur}
              selectionColor={theme.colors.primary.default}
              placeholderTextColor={placeholderColor}
            />
          </View>
          <View style={styles.iconView}>
            {focused && (
              <>
                <SizedBox width={Spacing.XS} />
                <TouchableOpacity onPress={onClearText}>
                  <Icon name="close" size={iconSize} />
                </TouchableOpacity>
              </>
            )}
            {renderTrailingIcon()}
          </View>
        </View>
      );
    };

    return (
      <View style={styles.wrapper}>
        {renderInputView()}
        <ErrorView error={error} />
      </View>
    );
  },
);

export default Input;
