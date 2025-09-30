import React, {FC, useContext} from 'react';
import {View} from 'react-native';
import {getStepColor, getStepTextStyle} from './utils';
import {
  ApplicationContext,
  Colors,
  Icon,
  SizedBox,
  Spacing,
  StepsProps,
  Styles,
  Text,
} from '../index';
import styles from './styles';

const StepsVertical: FC<StepsProps> = ({steps, activeIndex, size}) => {
  const {theme} = useContext(ApplicationContext);
  return (
    <View>
      {steps.map((i, index) => {
        const {error, description, title, time} = steps[index];
        const stepStyle = getStepColor(
          theme,
          activeIndex,
          index,
          error,
          steps.length,
        );
        const typoStyle = getStepTextStyle(
          theme,
          activeIndex,
          index,
          error,
          size,
        );
        const {backgroundColor, borderColor} = stepStyle;
        let lineColor = theme.colors.background.disable;
        if (activeIndex > index) {
          lineColor = theme.colors.primary.light;
        }
        const iconSource = error ? 'close' : 'check';
        let iconStyle = styles.stepIcon;
        let checkIconSize = 16;

        if (size === 'small') {
          iconStyle = styles.stepIconSmall;
          checkIconSize = 12;
        }
        return (
          <View key={`Step ${index}`} style={Styles.row}>
            <View style={styles.iconContainer}>
              <View style={[iconStyle, {backgroundColor, borderColor}]}>
                <Icon
                  size={checkIconSize}
                  color={index <= activeIndex ? Colors.white : undefined}
                  name={iconSource}
                />
              </View>
              {index !== steps.length - 1 && (
                <View
                  style={[
                    styles.lineVertical,
                    {backgroundColor: lineColor, marginVertical: Spacing.XS},
                  ]}
                />
              )}
            </View>
            <View style={Styles.flex}>
              <View style={Styles.rowSpace}>
                <Text
                  numberOfLines={2}
                  style={Styles.flex}
                  color={typoStyle.title.color}
                  typography={typoStyle.title.typography}>
                  {title}
                </Text>
                <SizedBox width={Spacing.S} />
                <Text
                  color={typoStyle.time.color}
                  typography={typoStyle.time.typography}>
                  {time}
                </Text>
              </View>
              <Text
                color={typoStyle.description.color}
                typography={typoStyle.description.typography}>
                {description}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default StepsVertical;
