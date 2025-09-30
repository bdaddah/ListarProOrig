import {StyleSheet} from 'react-native';
import {Radius, Spacing} from '../Consts';

export default StyleSheet.create({
  dotContainer: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'blue',
  },
  defaultContainer: {
    paddingHorizontal: Spacing.XS,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.L,
  },
});
