import {StyleSheet} from 'react-native';
import {Radius, Spacing} from '@passionui/components';

export default StyleSheet.create({
  buttonCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContainer: {
    paddingVertical: Spacing.M,
    borderTopLeftRadius: Radius.L,
    borderTopRightRadius: Radius.L,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: Radius.M,
  },
});
