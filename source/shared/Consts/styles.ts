import {StyleSheet} from 'react-native';
import {Spacing} from './colors+spacing+radius';

const Styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  full: {width: '100%', height: '100%'},
  fullWidth: {width: '100%'},
  fullHeight: {height: '100%'},
  flexRow: {
    flex: 1,
    flexDirection: 'row',
  },
  flexCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexStart: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  flexEnd: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowSpace: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowSpaceStart: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  rowSpaceEnd: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  columnSpace: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  columnSpaceEnd: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  columnSpaceStart: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  columnCenter: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnCenterLeft: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  columnCenterRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  selfCenter: {
    alignSelf: 'center',
  },
  paddingXS: {
    padding: Spacing.XS,
  },
  paddingS: {
    padding: Spacing.S,
  },
  paddingM: {
    padding: Spacing.M,
  },
  paddingL: {
    padding: Spacing.L,
  },
  paddingXL: {
    padding: Spacing.XL,
  },
  paddingHorizontalXS: {
    paddingHorizontal: Spacing.XS,
  },
  paddingHorizontalS: {
    paddingHorizontal: Spacing.S,
  },
  paddingHorizontalM: {
    paddingHorizontal: Spacing.M,
  },
  paddingHorizontalL: {
    paddingHorizontal: Spacing.L,
  },
  paddingHorizontalXL: {
    paddingHorizontal: Spacing.XL,
  },
  paddingVerticalXS: {
    paddingVertical: Spacing.XS,
  },
  paddingVerticalS: {
    paddingVertical: Spacing.S,
  },
  paddingVerticalM: {
    paddingVertical: Spacing.M,
  },
  paddingVerticalL: {
    paddingVertical: Spacing.L,
  },
  paddingVerticalXL: {
    paddingVertical: Spacing.XL,
  },
  marginXS: {
    margin: Spacing.XS,
  },
  marginS: {
    margin: Spacing.S,
  },
  marginM: {
    margin: Spacing.M,
  },
  marginL: {
    margin: Spacing.L,
  },
  marginXL: {
    margin: Spacing.XL,
  },
  borderRadiusXS: {
    borderRadius: Spacing.XS,
  },
  borderRadiusS: {
    borderRadius: Spacing.S,
  },
  borderRadiusM: {
    borderRadius: Spacing.M,
  },
  borderRadiusL: {
    borderRadius: Spacing.L,
  },
  borderRadiusXL: {
    borderRadius: Spacing.XL,
  },
  textCenter: {
    textAlign: 'center',
  },
  textCapitalize: {
    textTransform: 'capitalize',
  },
  textLineThrough: {
    textDecorationLine: 'line-through',
  },
});

export {Styles};
