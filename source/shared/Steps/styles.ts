import {StyleSheet} from 'react-native';
import {Radius, Spacing} from '../Consts';

export default StyleSheet.create({
  container: {
    width: '100%',
  },
  horizontalContainer: {flexDirection: 'row', alignItems: 'flex-start'},
  iconContainer: {
    alignItems: 'center',
    marginRight: Spacing.M,
    minHeight: 48,
  },
  stepIcon: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: Radius.M,
    alignItems: 'center',
    justifyContent: 'center',
    margin: Spacing.XS,
  },
  stepIconSmall: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderRadius: Radius.S,
    alignItems: 'center',
    justifyContent: 'center',
    margin: Spacing.XS,
  },
  lineHorizontal: {
    height: 2,
    flex: 1,
  },
  lineVertical: {
    width: 2,
    minHeight: 20,
    flex: 1,
  },
  radiusLeft: {
    borderTopLeftRadius: Radius.S,
    borderBottomLeftRadius: Radius.S,
  },
  radiusRight: {
    borderTopRightRadius: Radius.S,
    borderBottomRightRadius: Radius.S,
  },
  textCenter: {
    textAlign: 'center',
  },
});
