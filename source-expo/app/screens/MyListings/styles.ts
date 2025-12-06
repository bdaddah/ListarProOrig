import {StyleSheet} from 'react-native';
import {Spacing} from '@passionui/components';

export default StyleSheet.create({
  statusContainer: {
    marginTop: Spacing.XS,
    marginLeft: Spacing.S,
  },
  statusBadge: {
    paddingHorizontal: Spacing.S,
    paddingVertical: Spacing.XXS,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
