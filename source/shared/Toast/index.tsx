import React, {FC, useContext} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {
  ApplicationContext,
  Colors,
  Divider,
  Icon,
  SizedBox,
  Spacing,
  Styles,
  Text,
  ToastProps,
  useTranslation,
} from '../index';
import styles from './styles';

const Toast: FC<ToastProps> = ({
  type,
  icon,
  message = 'Toast Message',
  action,
}) => {
  const {t} = useTranslation();
  const {theme} = useContext(ApplicationContext);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return theme.colors.success.default;
      case 'warning':
        return theme.colors.warning.default;
      default:
        return Colors.black_04;
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: getBackgroundColor()}]}>
      <SizedBox width={Spacing.M} />
      {!!icon && (
        <View style={Styles.row}>
          <Icon name={icon} size={24} color={Colors.white} />
          <SizedBox width={Spacing.S} />
        </View>
      )}
      <Text typography={'subhead'} color={Colors.white} style={Styles.flex}>
        {t(message)}
      </Text>
      {action?.title && (
        <>
          <View style={Styles.paddingVerticalS}>
            <Divider size={0.5} direction={'vertical'} color={Colors.white} />
          </View>
          <TouchableOpacity
            style={Styles.paddingHorizontalM}
            onPress={action.onPress}>
            <Text
              typography={'caption2'}
              fontWeight={'bold'}
              color={Colors.white}
              numberOfLines={2}>
              {action?.title}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export {Toast};
