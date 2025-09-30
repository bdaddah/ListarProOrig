import {StyleSheet} from 'react-native';
import {Radius} from '@passionui/components';

export default StyleSheet.create({
  item: {
    width: '25%',
    aspectRatio: 1,
    padding: 4,
  },
  image: {
    borderRadius: Radius.M,
  },
  delete: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
