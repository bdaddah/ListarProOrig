import React, {useContext, useState} from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {
  ApplicationContext,
  DividerProps,
  SizedBox,
  Spacing,
  Styles,
} from '../index';

const Divider: React.FC<DividerProps> = ({
  size = 1,
  type = 'line',
  direction = 'horizontal',
  dashSpecs,
  color,
  style,
}) => {
  const {theme} = useContext(ApplicationContext);
  const dashSize = 4;
  const dashSpacing = dashSpecs?.dashGap ?? Spacing.XS;
  const [lineLength, setLineLength] = useState(0);
  const numOfDashes = Math.ceil(lineLength / dashSpacing / 2);

  let styleLine: ViewStyle = {
    height: '100%',
    width: size,
    overflow: 'hidden',
    justifyContent: 'space-between',
  };
  if (direction === 'horizontal') {
    styleLine = {
      width: '100%',
      height: size,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'space-between',
    };
  }

  /**
   * Render dash divider
   */
  if (type === 'dash') {
    /**
     * Render dash dot divider
     */
    if (dashSpecs?.useDot) {
      let indicatorStyle: ViewStyle = {
        width: size,
        height: dashSize,
        marginRight: 0,
        backgroundColor: color ?? theme.colors.border.default,
      };
      styleLine = {
        width: size,
        flex: 1,
        justifyContent: 'space-between',
        marginVertical: Spacing.XS,
      };

      if (direction === 'horizontal') {
        styleLine = {
          flex: 1,
          height: size,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: Spacing.XS,
        };
        indicatorStyle = {
          width: dashSize,
          height: size,
          backgroundColor: color ?? theme.colors.border.default,
        };
        return (
          <View style={[Styles.rowSpace, style]}>
            <SizedBox width={6}>
              <View
                style={[styles.dotLeft, {backgroundColor: dashSpecs.dotColor}]}
              />
            </SizedBox>
            <View
              onLayout={event => {
                const {width} = event.nativeEvent.layout;
                if (lineLength !== width) {
                  setLineLength(width);
                }
              }}
              style={[styleLine]}>
              {[...Array(numOfDashes)].map((_, i) => {
                return <View key={`Divider${i}`} style={indicatorStyle} />;
              })}
            </View>
            <SizedBox width={6}>
              <View
                style={[styles.dotRight, {backgroundColor: dashSpecs.dotColor}]}
              />
            </SizedBox>
          </View>
        );
      }

      return (
        <View style={[Styles.columnCenter, style]}>
          <SizedBox height={6}>
            <View
              style={[styles.dotBottom, {backgroundColor: dashSpecs.dotColor}]}
            />
          </SizedBox>
          <View
            onLayout={event => {
              const {height} = event.nativeEvent.layout;
              if (lineLength !== height) {
                setLineLength(height);
              }
            }}
            style={[styleLine]}>
            {[...Array(numOfDashes)].map((_, i) => {
              return <View key={`Divider${i}`} style={indicatorStyle} />;
            })}
          </View>
          <SizedBox height={6}>
            <View
              style={[styles.dotTop, {backgroundColor: dashSpecs.dotColor}]}
            />
          </SizedBox>
        </View>
      );
    }

    /**
     * Render dash divider
     */
    if (direction === 'horizontal') {
      styleLine = {
        width: '100%',
        height: size,
        flexDirection: 'row',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'space-between',
      };
    }

    return (
      <View
        onLayout={event => {
          const {width, height} = event.nativeEvent.layout;
          const length = direction === 'horizontal' ? width : height;
          if (lineLength !== length) {
            setLineLength(length);
          }
        }}
        style={[styleLine, style]}>
        {[...Array(numOfDashes)].map((_, i) => {
          let indicatorStyle: ViewStyle = {
            width: size,
            height: dashSize,
            marginRight: 0,
            backgroundColor: color ?? theme.colors.border.default,
          };
          if (direction === 'horizontal') {
            indicatorStyle = {
              width: dashSize,
              height: size,
              backgroundColor: color ?? theme.colors.border.default,
            };
          }
          return <View key={`Divider${i}`} style={indicatorStyle} />;
        })}
      </View>
    );
  }

  /**
   * Render line divider
   */
  return (
    <View
      style={[
        styleLine,
        {backgroundColor: color ?? theme.colors.border.default},
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  dotTop: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 6,
    backgroundColor: 'red',
  },
  dotBottom: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: -6,
    backgroundColor: 'red',
  },
  dotLeft: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  dotRight: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: -6,
  },
});
export {Divider};
