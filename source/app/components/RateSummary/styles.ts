import {StyleSheet} from 'react-native';
import {Radius, Spacing} from '@passionui/components';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.M,
    borderRadius: Radius.M,
  },
  containRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  starLeft: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  lineStar: {
    height: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  containStatus: {flex: 1, justifyContent: 'center'},
  contentLineStatus: {
    height: 10,
    justifyContent: 'center',
  },
  lineStatusGray: {
    height: 3,
    width: '100%',
    borderRadius: 1.5,
  },
  lineStatusPrimary: {
    height: 3,
    borderTopLeftRadius: 1.5,
    borderBottomLeftRadius: 1.5,
    position: 'absolute',
  },
});
