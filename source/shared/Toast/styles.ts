import {StyleSheet} from 'react-native';
import {Radius, Colors} from '../index';

export default StyleSheet.create({
  container: {
    height: 48,
    borderRadius: Radius.S,
    width: '100%',
    backgroundColor: Colors.black_04,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
