import {StyleSheet} from 'react-native';
import {Spacing} from '@passionui/components';

export default StyleSheet.create({
  container: {
    borderWidth: 2,
    padding: 1,
    borderStyle: 'dotted',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    width: '100%',
    height: '100%',
  },
  image: {width: '100%', height: '100%'},
  uploadProcessing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadProcessingLine: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: Spacing.M,
  },
  line: {width: '100%'},
});
