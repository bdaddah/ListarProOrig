import React, {FC, useContext} from 'react';
import {Pressable, TextInput, View} from 'react-native';
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
  InputDropDownProps,
  SizedBox,
  Spacing,
} from '../index';
import styles from './styles';

const InputDropDown: FC<InputDropDownProps> = ({
  floatingValue,
  floatingIcon,
  leading,
  size = 'small',
  error,
  trailing,
  disabled,
  floatingIconColor,
  required,
  onPress,
  style,
  ...props
}) => {
  const {theme} = useContext(ApplicationContext);

  const renderInputView = () => {
    const disabledColor = theme.colors.text.disable;
    const iconSize = getIconSize(size);
    let textColor = theme.colors.text.default;
    let placeholderColor = theme.colors.text.hint;
    let iconColor: string;

    if (disabled) {
      textColor = disabledColor;
      placeholderColor = disabledColor;
      iconColor = disabledColor;
    }

    const renderLeadingIcon = () => {
      if (leading) {
        return (
          <>
            <SizedBox width={Spacing.M} />
            {typeof leading === 'string' ? (
              <Icon color={iconColor} name={leading} size={iconSize} />
            ) : (
              leading
            )}
          </>
        );
      }
    };

    const renderTrailingIcon = () => {
      if (trailing) {
        return (
          <SizedBox width={iconSize} height={iconSize}>
            {typeof trailing === 'string' ? (
              <Icon color={iconColor} name={trailing} size={iconSize} />
            ) : (
              trailing
            )}
          </SizedBox>
        );
      }

      return <Icon color={iconColor} name={'chevron-down'} size={iconSize} />;
    };

    return (
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: theme.colors.background.surface,
          },
          !!floatingValue && {marginTop: Spacing.S},
          getSizeStyle(size),
          getBorderColor(theme, false, error, disabled),
        ]}>
        <FloatingView
          floatingValue={floatingValue}
          floatingIconColor={floatingIconColor}
          disabled={disabled}
          required={required}
          floatingIcon={floatingIcon}
        />
        {renderLeadingIcon()}
        <Pressable style={styles.inputView} onPress={onPress}>
          <TextInput
            {...props}
            onPress={onPress}
            editable={false}
            textAlignVertical="center"
            style={[
              styles.input,
              getFontStyle(theme, size),
              {color: textColor, lineHeight: undefined},
              style,
            ]}
            textBreakStrategy="highQuality"
            selectionColor={theme.colors.primary.default}
            placeholderTextColor={placeholderColor}
          />
        </Pressable>
        <View style={styles.iconView}>{renderTrailingIcon()}</View>
      </View>
    );
  };

  return (
    <View style={styles.wrapper}>
      {renderInputView()}
      <ErrorView error={error} />
    </View>
  );
};

export default InputDropDown;
