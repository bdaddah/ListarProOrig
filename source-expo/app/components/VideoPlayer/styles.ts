import {StyleSheet} from 'react-native';
import {Colors, Radius} from '@passionui/components';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  hidden: {width: 0, height: 0, overflow: 'hidden'},
  controlContainer: {
    position: 'absolute',
    flexDirection: 'row',
    backgroundColor: Colors.modal,
    borderRadius: Radius.XL,
    zIndex: 1,
  },
});
