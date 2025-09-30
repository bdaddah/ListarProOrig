import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  NativeSyntheticEvent,
  TextInput,
  TextInputFocusEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import {ErrorView, getBorderColor} from './common';
import {
  ApplicationContext,
  CaretProps,
  InputOTPProps,
  Spacing,
  Text,
  Styles,
} from '../index';
import styles from './styles';

const OTPCaret: React.FC<CaretProps> = ({index, length}) => {
  const DURATION = 300;
  const {theme} = useContext(ApplicationContext);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: DURATION,
          useNativeDriver: true,
        }),
        Animated.delay(DURATION * 2),
        Animated.timing(opacity, {
          toValue: 0,
          duration: DURATION,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [opacity]);

  const spacingStyle = index !== length - 1 && {marginRight: Spacing.L};

  return (
    <View style={[styles.otpContainer, spacingStyle]}>
      <Animated.View
        style={[
          styles.otpCaret,
          {
            backgroundColor: theme.colors.primary.default,
            opacity,
          },
        ]}
      />
    </View>
  );
};
const InputOTP = forwardRef(
  (
    {
      length = 10,
      error,
      floatingValue,
      onChangeText,
      onBlur,
      dataType = 'number',
      style,
      ...props
    }: InputOTPProps,
    ref,
  ) => {
    const {theme} = useContext(ApplicationContext);
    const inputRef = useRef<TextInput>(null);
    const [value, setValue] = useState('');
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
        setValue('');
      },
    }));

    const onFocusInput = () => {
      setFocused(true);
      inputRef?.current?.focus();
    };

    const onBlurInput = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setFocused(false);
      onBlur?.(e);
    };

    const _onChangeText = (text: string) => {
      if (text.length > length) {
        return;
      }
      if (dataType === 'number' && isNaN(Number(text))) {
        return;
      }
      setValue(text);
      onChangeText?.(text);
    };

    const renderInputs = (index: number) => {
      const TextInputs: React.ReactNode[] = [];
      for (let i = 0; i < index; i++) {
        const styleItem = i !== index - 1 && {marginRight: Spacing.L};
        let item = (
          <View
            style={[
              styles.otpItem,
              {backgroundColor: theme.colors.text.default},
              styleItem,
            ]}
          />
        );
        if (value[i]) {
          item = (
            <Text
              style={[styles.otpContainer, styleItem]}
              typography={'headline'}
              fontWeight="bold">
              {value[i]}
            </Text>
          );
        }
        TextInputs.push(
          <View key={`OTPCaret${i}`}>
            {focused && value.length === i ? (
              <OTPCaret index={i} length={index} />
            ) : (
              item
            )}
          </View>,
        );
      }
      return TextInputs;
    };

    const renderInputView = () => {
      return (
        <View
          style={[
            styles.otpInput,
            {backgroundColor: theme.colors.background.surface},
            getBorderColor(theme, focused, error),
          ]}>
          {!!floatingValue && (
            <View
              style={[
                styles.otpFloatingView,
                {backgroundColor: theme.colors.background.surface},
              ]}>
              <Text typography={'caption1'}>{floatingValue}</Text>
            </View>
          )}
          <View style={styles.otpInputsView}>
            {length ? renderInputs(length) : renderInputs(value.length + 1)}
          </View>
          <View style={styles.inputView}>
            <TextInput
              {...props}
              ref={inputRef}
              value={value}
              onChangeText={_onChangeText}
              keyboardType={dataType === 'number' ? 'number-pad' : 'default'}
              onFocus={onFocusInput}
              onBlur={onBlurInput}
              style={styles.otpTextInput}
              selectionColor={theme.colors.primary.default}
              placeholderTextColor={theme.colors.text.hint}
            />
          </View>
        </View>
      );
    };

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={onFocusInput}
        style={[style, styles.otpWrapper]}>
        {renderInputView()}
        <ErrorView error={error} style={Styles.rowCenter} />
      </TouchableOpacity>
    );
  },
);

export default InputOTP;
