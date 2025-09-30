import {StyleSheet} from 'react-native';
import {Spacing} from '@passionui/components';

export default StyleSheet.create({
  searchContainer: {
    paddingHorizontal: Spacing.M,
    paddingVertical: Spacing.S,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {position: 'absolute', top: 4, right: 4},
});
