import {StyleSheet} from 'react-native';
import {Radius} from '@passionui/components';

export default StyleSheet.create({
  featureImage: {
    height: 180,
    width: '100%',
    borderRadius: Radius.M,
  },
  galleryImage: {
    width: 80,
    height: 80,
    borderRadius: Radius.M,
  },
  badge: {position: 'absolute', top: -2, right: -2},
  uploadIcon: {
    position: 'absolute',
    alignSelf: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textarea: {height: 100},
  iconColor: {
    width: 24,
    height: 24,
    borderRadius: Radius.XS,
  },
});
