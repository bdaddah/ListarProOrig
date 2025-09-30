import {StyleSheet} from 'react-native';
import {Radius, Spacing} from '@passionui/components';

export default StyleSheet.create({
  container: {
    padding: Spacing.M,
    borderRadius: Radius.M,
  },
  authorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  line: {
    height: 10,
    marginTop: Spacing.S,
  },
});
