import {StyleSheet} from 'react-native';
import {Radius, Spacing} from '@passionui/components';

export default StyleSheet.create({
  video: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  maxHeight: {
    height: '100%',
  },
  /**
   * Style for detail 1
   */
  action: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  containerCard: {position: 'absolute', width: '100%', zIndex: 1},
  card: {
    borderRadius: Spacing.M,
    margin: Spacing.M,
  },
  cardEmpty: {
    height: 90,
    width: '100%',
  },
  rightAction: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  /**
   * Style for detail 3
   */
  mapview: {height: 160, borderRadius: Radius.M},
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconInfo: {
    width: 32,
    height: 32,
    borderRadius: Radius.L,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subInfoContent: {
    paddingLeft: 40,
  },
  subInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  socialItem: {width: 32, height: 32},
  socialContent: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    paddingLeft: 40,
    gap: Spacing.S,
  },
  featureContent: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: Spacing.S,
  },
  line: {
    height: 10,
  },
});
