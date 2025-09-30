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
import styles from './styles';
import {Text} from '../Text';
import {ErrorView, FloatingView, getBorderColor, getFontStyle} from './common';
import {Icon} from '../Icon';
import {ApplicationContext} from '../Application';
import {InputTextAreaProps} from './types';
import {Spacing} from '../Consts';

const InputTextArea = forwardRef(
  (
    {
      error,
      onChangeText,
      floatingIconColor,
      floatingIcon,
      floatingValue,
      onFocus,
      onBlur,
      disabled,
      maxLength = 300,
      required,
      style,
      ...props
    }: InputTextAreaProps,
    ref,
  ) => {
    const inputRef = useRef<TextInput>(null);
    const {theme} = useContext(ApplicationContext);
    const [focused, setFocused] = useState(false);
    const [inputValue, setInputValue] = useState(props.defaultValue ?? '');

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef?.current?.focus();
      },
      blur: () => {
        inputRef?.current?.blur();
      },
      clear: () => {
        inputRef?.current?.clear();
      },
      setText: (value: string) => {
        inputRef?.current?.setNativeProps({text: value});
        _onChangeText(value);
      },
    }));

    const onClearText = () => {
      inputRef?.current?.clear();
      _onChangeText('');
    };

    const _onChangeText = (text: string) => {
      onChangeText?.(text);
      setInputValue(text);
    };

    const _onFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setFocused(true);
      onFocus?.(e);
    };

    const _onBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setFocused(false);
      onBlur?.(e);
    };

    const renderCountingView = () => {
      return (
        <View style={styles.countingView}>
          <Text color={theme.colors.text.hint} typography={'caption2'}>
            {`${inputValue.length}/${maxLength}`}
          </Text>
        </View>
      );
    };
    const renderInputView = () => {
      const disabledColor = theme.colors.text.disable;
      let textColor = theme.colors.text.default;
      let placeholderColor = theme.colors.text.hint;

      if (disabled) {
        textColor = disabledColor;
        placeholderColor = disabledColor;
      }

      return (
        <View
          style={[
            styles.textAreaWrapper,
            {
              backgroundColor: theme.colors.background.surface,
            },
            !!floatingValue && {marginTop: Spacing.S},
            getBorderColor(theme, focused, error, disabled),
          ]}>
          <FloatingView
            floatingValue={floatingValue}
            floatingIconColor={floatingIconColor}
            disabled={disabled}
            floatingIcon={floatingIcon}
            required={required}
          />
          <View style={styles.rowArea}>
            <View style={styles.textAreaView}>
              <TextInput
                ref={inputRef}
                {...props}
                editable={!disabled}
                textAlignVertical="top"
                style={[
                  styles.textArea,
                  getFontStyle(theme, 'small'),
                  {color: textColor, lineHeight: undefined},
                  style,
                ]}
                textBreakStrategy="highQuality"
                multiline={true}
                onChangeText={_onChangeText}
                onFocus={_onFocus}
                onBlur={_onBlur}
                selectionColor={theme.colors.primary.default}
                placeholderTextColor={placeholderColor}
              />
            </View>
            {focused && (
              <TouchableOpacity onPress={onClearText}>
                <Icon name="close" size={18} color={theme.colors.text.hint} />
              </TouchableOpacity>
            )}
          </View>
          {renderCountingView()}
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

export default InputTextArea;
