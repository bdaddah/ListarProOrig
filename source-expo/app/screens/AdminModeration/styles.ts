import {StyleSheet} from 'react-native';
import {Spacing} from '@passionui/components';

export default StyleSheet.create({
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.S,
    marginLeft: Spacing.S,
  },
  approveButton: {
    minWidth: 80,
  },
  rejectButton: {
    minWidth: 80,
  },
});
