import React, {useContext} from 'react';
import {View} from 'react-native';

import {
  ApplicationContext,
  Icon,
  Shadow,
  SizedBox,
  Spacing,
  Styles,
  Text,
} from '@passionui/components';
import {RateSummaryModel} from '@models+types';
import styles from './styles';

export type RateSummaryProps = {
  data?: RateSummaryModel;
  style?: any;
};

const RateSummary: React.FC<RateSummaryProps> = ({style, data}) => {
  const {theme, translate} = useContext(ApplicationContext);

  if (data) {
    return (
      <View
        style={[
          styles.container,
          Shadow.light,
          {backgroundColor: theme.colors.background.surface},
          style,
        ]}>
        <View style={Styles.columnCenter}>
          <Text
            typography="title1"
            color={theme.colors.primary.default}
            fontWeight="semibold">
            {data.avg}
          </Text>
          <Text typography="headline" fontWeight="bold">
            {translate('out_of')} 5
          </Text>
        </View>
        <SizedBox width={Spacing.M} />
        <View style={styles.containRight}>
          <View style={Styles.row}>
            <View style={styles.starLeft}>
              <View style={Styles.row}>
                {[1, 2, 3, 4, 5].map((icon, index) => {
                  return <Icon key={'star5' + index} name="star" size={10} />;
                })}
              </View>
              <View style={Styles.row}>
                {[1, 2, 3, 4].map((icon, index) => {
                  return <Icon key={'star4' + index} name="star" size={10} />;
                })}
              </View>
              <View style={Styles.row}>
                {[1, 2, 3].map((icon, index) => {
                  return <Icon key={'star3' + index} name="star" size={10} />;
                })}
              </View>
              <View style={Styles.row}>
                {[1, 2].map((icon, index) => {
                  return <Icon key={'star2' + index} name="star" size={10} />;
                })}
              </View>
              <View style={Styles.row}>
                <Icon name="star" size={10} />
              </View>
            </View>
            <SizedBox width={8} />
            <View style={styles.containStatus}>
              <View style={styles.contentLineStatus}>
                <View
                  style={[
                    styles.lineStatusGray,
                    {backgroundColor: theme.colors.background.disable},
                  ]}
                />
                <View
                  style={[
                    styles.lineStatusPrimary,
                    {
                      width: `${data.five * 100}%`,
                      backgroundColor: theme.colors.primary.default,
                    },
                  ]}
                />
              </View>
              <View style={styles.contentLineStatus}>
                <View
                  style={[
                    styles.lineStatusGray,
                    {backgroundColor: theme.colors.background.disable},
                  ]}
                />
                <View
                  style={[
                    styles.lineStatusPrimary,
                    {
                      width: `${data.four * 100}%`,
                      backgroundColor: theme.colors.primary.default,
                    },
                  ]}
                />
              </View>
              <View style={styles.contentLineStatus}>
                <View
                  style={[
                    styles.lineStatusGray,
                    {backgroundColor: theme.colors.background.disable},
                  ]}
                />
                <View
                  style={[
                    styles.lineStatusPrimary,
                    {
                      width: `${data.three * 100}%`,
                      backgroundColor: theme.colors.primary.default,
                    },
                  ]}
                />
              </View>
              <View style={styles.contentLineStatus}>
                <View
                  style={[
                    styles.lineStatusGray,
                    {backgroundColor: theme.colors.background.disable},
                  ]}
                />
                <View
                  style={[
                    styles.lineStatusPrimary,
                    {
                      width: `${data.two * 100}%`,
                      backgroundColor: theme.colors.primary.default,
                    },
                  ]}
                />
              </View>
              <View style={styles.contentLineStatus}>
                <View
                  style={[
                    styles.lineStatusGray,
                    {backgroundColor: theme.colors.background.disable},
                  ]}
                />
                <View
                  style={[
                    styles.lineStatusPrimary,
                    {
                      width: `${data.one * 100}%`,
                      backgroundColor: theme.colors.primary.default,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
          <SizedBox height={4} />
          <Text typography="subhead" fontWeight="bold">
            {data.total} {translate('ratings')}
          </Text>
        </View>
      </View>
    );
  }

  return <View />;
};

export {RateSummary};
