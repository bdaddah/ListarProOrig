import {StyleSheet} from 'react-native';
import {Radius} from '@passionui/components';

export default StyleSheet.create({
  /**
   * list
   */
  authorImage: {
    width: 32,
    height: 32,
    borderRadius: Radius.L,
  },
  listImage: {
    width: 120,
    height: 120,
    borderRadius: Radius.M,
  },

  /**
   * grid
   */
  gridImage: {
    width: '100%',
    height: 120,
    borderRadius: Radius.M,
  },

  /**
   * block
   */
  blockImage: {
    width: '100%',
    height: 200,
    borderRadius: Radius.M,
  },

  /**
   * sticky
   */
  stickyImage: {
    width: '100%',
    height: 200,
    borderRadius: Radius.M,
  },
});
