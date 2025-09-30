import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  topLeft: {
    width: 32,
    height: 32,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {width: 32, height: 32, borderTopWidth: 4, borderRightWidth: 4},
  bottomLeft: {width: 32, height: 32, borderBottomWidth: 4, borderLeftWidth: 4},
  bottomRight: {
    width: 32,
    height: 32,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  qrContent: {width: 200, height: 200, alignSelf: 'center'},
  bottomCenter: {
    position: 'absolute',
    bottom: 56,
    alignSelf: 'center',
  },
});
