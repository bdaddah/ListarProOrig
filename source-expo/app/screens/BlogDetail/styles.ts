import {StyleSheet} from 'react-native';
import {Radius, Spacing} from '@passionui/components';

export default StyleSheet.create({
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: Radius.L,
  },
  image: {
    height: 200,
    width: '100%',
    borderRadius: Radius.M,
  },
  line: {
    height: 12,
    marginTop: Spacing.S,
  },
  webviewContainer: {
    width: '100%',
    backgroundColor: 'transparent',
  },
});
