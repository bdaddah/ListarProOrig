import React, {FC, useContext} from 'react';
import {View} from 'react-native';
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
import {getStepColor, getStepTextStyle} from './utils';
import styles from './styles';

const StepsHorizontal: FC<StepsProps> = ({steps, size, activeIndex}) => {
  const {theme} = useContext(ApplicationContext);

  const renderStepIcon = (index: number) => {
    const {error, icon} = steps[index];
    const stepStyle = getStepColor(
      theme,
      activeIndex,
      index,
      error,
      steps.length,
    );
    const iconSource = error ? 'close' : 'check';
    let iconStyle = styles.stepIcon;
    let checkIconSize = 14;
    if (size === 'small') {
      iconStyle = styles.stepIconSmall;
      checkIconSize = 12;
    }
    return (
      <View style={Styles.rowCenter}>
        <View
          style={[
            styles.lineHorizontal,
            styles.radiusRight,
            {
              backgroundColor: stepStyle.lineColorLeft,
            },
          ]}
        />
        <View
          style={[
            iconStyle,
            {
              backgroundColor: stepStyle.backgroundColor,
              borderColor: stepStyle.borderColor,
            },
          ]}>
          <Icon
            size={checkIconSize}
            color={index <= activeIndex ? Colors.white : undefined}
            name={icon ?? iconSource}
          />
        </View>
        <View
          style={[
            styles.lineHorizontal,
            styles.radiusLeft,
            {
              backgroundColor: stepStyle.lineColorRight,
            },
          ]}
        />
      </View>
    );
  };

  return (
    <View style={styles.horizontalContainer}>
      {steps.map((_, index) => {
        const {title, description, error, time} = steps[index];
        const typoStyle = getStepTextStyle(
          theme,
          activeIndex,
          index,
          error,
          size,
        );
        return (
          <View key={`Step ${index}`} style={Styles.flexCenter}>
            {!!time && (
              <Text
                style={styles.textCenter}
                color={typoStyle.time.color}
                typography={typoStyle.time.typography}
                fontWeight={typoStyle.time.fontWeight}>
                {time}
              </Text>
            )}
            {renderStepIcon(index)}
            {!!title && (
              <>
                <Text
                  style={styles.textCenter}
                  color={typoStyle.title.color}
                  typography={typoStyle.title.typography}
                  fontWeight={typoStyle.title.fontWeight}>
                  {title}
                </Text>
                <SizedBox height={Spacing.XS} />
              </>
            )}
            {!!description && (
              <Text
                style={styles.textCenter}
                color={typoStyle.description.color}
                typography={typoStyle.description.typography}
                fontWeight={typoStyle.description.fontWeight}>
                {description}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
};

export default StepsHorizontal;
