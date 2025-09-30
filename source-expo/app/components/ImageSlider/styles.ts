import {StyleSheet} from 'react-native';
import {Colors, Radius, Spacing} from '@passionui/components';

export default StyleSheet.create({
  dotStyle: {
    borderRadius: Radius.XL,
    width: 8,
    height: 8,
    backgroundColor: Colors.black_17,
  },
  containerPagination: {
    gap: Spacing.S,
    position: 'absolute',
  },
});
