import {StyleSheet} from 'react-native';
import {Spacing} from '@passionui/components';

export default StyleSheet.create({
  wrapLine: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.S,
  },
  slider: {height: 24},
  colorContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: Spacing.M,
  },
  colorIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
