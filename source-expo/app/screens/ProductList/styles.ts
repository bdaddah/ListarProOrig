import {StyleSheet} from 'react-native';
import {Radius, Spacing} from '@passionui/components';

export default StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    padding: Spacing.M,
    alignItems: 'center',
  },
  carousel: {
    position: 'absolute',
    bottom: Spacing.M,
    right: 0,
    alignItems: 'flex-end',
  },
  item: {
    padding: Spacing.S,
    borderRadius: Radius.M,
  },
});
