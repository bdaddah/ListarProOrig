import {StyleSheet} from 'react-native';
import {Spacing} from '@passionui/components';

export default StyleSheet.create({
  searchContainer: {
    paddingHorizontal: Spacing.M,
    paddingVertical: Spacing.S,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {width: 120},
});
