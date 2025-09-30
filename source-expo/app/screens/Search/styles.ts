import {StyleSheet} from 'react-native';
import {Spacing} from '@passionui/components';

export default StyleSheet.create({
  list: {
    paddingHorizontal: Spacing.M,
    paddingBottom: Spacing.M,
  },
  listHistory: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.S,
  },
});
