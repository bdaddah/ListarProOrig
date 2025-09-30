import {StyleSheet} from 'react-native';
import {Radius} from '@passionui/components';

export default StyleSheet.create({
  container: {
    height: 300,
    width: '100%',
  },
  hueOpacityPreviewContainer: {
    flexWrap: 'nowrap',
    flexDirection: 'row',
    alignItems: 'center',
  },
  panel: {
    height: 200,
    borderRadius: Radius.M,
  },
  previewStyle: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
});
