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
  ApplicationContext,
  Icon,
  InputSearchProps,
  Shadow,
  Spacing,
  Styles,
} from '../index';
import {getBorderColor, getFontStyle} from './common';

import styles from './styles';

const InputSearch = forwardRef(
  (
    {
      onFocus,
      onBlur,
      size = 'medium',
      onChangeText,
      icon,
      iconColor,
      onPressIcon,
      useShadow,
      style,
      ...props
    }: InputSearchProps,
    ref,
  ) => {
    const inputRef = useRef<TextInput>(null);
    const {theme} = useContext(ApplicationContext);
    const [focused, setFocused] = useState(false);

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

    const _onFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setFocused(true);
      onFocus?.(e);
    };

    const _onBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setFocused(false);
      onBlur?.(e);
    };

    const onClearText = () => {
      inputRef?.current?.clear();
      _onChangeText('');
    };

    const _onChangeText = (text: string) => {
      onChangeText?.(text);
    };

    const getSizeStyle = () => {
      switch (size) {
        case 'large':
          return styles.searchInputLarge;
        case 'medium':
          return styles.searchInputMedium;
        default:
          return styles.searchInputSmall;
      }
    };

    const getIconSize = () => {
      switch (size) {
        case 'large':
          return 24;
        case 'medium':
          return 20;
        default:
          return 18;
      }
    };

    const renderInputView = () => {
      let textColor = theme.colors.text.default;
      let placeholderColor = theme.colors.text.hint;

      return (
        <TextInput
          ref={inputRef}
          {...props}
          textAlignVertical="center"
          style={[
            getSizeStyle(),
            getFontStyle(theme, 'small'),
            {color: textColor, lineHeight: undefined},
            style,
          ]}
          onChangeText={_onChangeText}
          onFocus={_onFocus}
          onBlur={_onBlur}
          selectionColor={theme.colors.primary.default}
          placeholderTextColor={placeholderColor}
        />
      );
    };

    const renderIconView = () => {
      if (icon) {
        return (
          <TouchableOpacity onPress={onPressIcon} style={Styles.paddingXS}>
            {typeof icon === 'string' ? (
              <Icon name={icon} size={getIconSize()} color={iconColor} />
            ) : (
              icon
            )}
          </TouchableOpacity>
        );
      }
    };

    return (
      <View
        style={[
          styles.searchInputWrapper,
          {
            backgroundColor: theme.colors.background.surface,
            paddingHorizontal: size === 'small' ? Spacing.S : Spacing.M,
          },
          useShadow
            ? Shadow.light
            : getBorderColor(theme, focused, undefined, undefined),
        ]}>
        <Icon name={'magnify'} size={getIconSize()} />
        {renderInputView()}
        <View style={Styles.rowCenter}>
          {focused && (
            <TouchableOpacity onPress={onClearText} style={Styles.paddingXS}>
              <Icon
                name={'close'}
                size={getIconSize()}
                color={theme.colors.text.hint}
              />
            </TouchableOpacity>
          )}
          {renderIconView()}
        </View>
      </View>
    );
  },
);

export default InputSearch;
