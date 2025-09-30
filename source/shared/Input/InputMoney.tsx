import React, {
  forwardRef,
  useContext,
  useEffect,
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
  InputMoneyProps,
  SizedBox,
  Spacing,
} from '../index';
import {formatMoneyToNumber, formatNumberToMoney} from './utils';
import styles from './styles';

const InputMoney = forwardRef(
  (
    {
      onChangeText,
      floatingValue,
      floatingIcon,
      size = 'small',
      onBlur,
      onFocus,
      error,
      trailing,
      disabled,
      floatingIconColor,
      iconColor,
      required,
      currency = '$',
      defaultValue,
      style,
      ...props
    }: InputMoneyProps,
    ref,
  ) => {
    const inputRef = useRef<TextInput>(null);
    const {theme} = useContext(ApplicationContext);
    const [focused, setFocused] = useState(false);
    const [value, setValue] = useState('');

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
      setText: (text: string) => {
        inputRef?.current?.setNativeProps({text: text});
        _onChangeText(value);
      },
    }));

    useEffect(() => {
      if (defaultValue) {
        const valueFormat = formatMoneyToNumber(defaultValue, currency);
        setValue(formatNumberToMoney(valueFormat, currency));
      }
    }, [currency, defaultValue]);

    const onClearText = () => {
      inputRef?.current?.clear();
      setValue('');
      onChangeText?.('');
    };

    const _onChangeText = (text: string) => {
      if (text.length < value.length && value.indexOf(text) === 0) {
        text = value.slice(0, -2) + currency;
      }
      const valueFormat = formatMoneyToNumber(text, currency);
      setValue(formatNumberToMoney(valueFormat, currency));
      onChangeText?.(formatMoneyToNumber(text, currency).toString());
    };

    const _onFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setFocused(true);
      onFocus?.(e);
    };

    const _onBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setFocused(false);
      onBlur?.(e);
    };

    const renderInputView = () => {
      const disabledColor = theme.colors.text.disable;
      const iconSize = getIconSize(size);
      let textColor = theme.colors.text.default;
      let placeholderColor = theme.colors.text.hint;
      let iconTintColor = iconColor;

      if (disabled) {
        textColor = disabledColor;
        placeholderColor = disabledColor;
        iconTintColor = disabledColor;
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
          <View style={styles.inputView}>
            <TextInput
              ref={inputRef}
              {...props}
              editable={!disabled}
              textAlignVertical="center"
              keyboardType={'number-pad'}
              style={[
                styles.moneyInput,
                getFontStyle(theme, size),
                {color: textColor, lineHeight: undefined},
                style,
              ]}
              value={value}
              onChangeText={_onChangeText}
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
            {!!trailing && (
              <>
                <SizedBox width={Spacing.S} />
                <Icon
                  color={iconTintColor}
                  name={trailing as string}
                  size={iconSize}
                />
              </>
            )}
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

export default InputMoney;
