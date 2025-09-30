import {StyleSheet} from 'react-native';
import {Colors, Radius, Spacing} from '../Consts';

export default StyleSheet.create({
  activeDot: {
    height: 4,
    width: 12,
    borderRadius: Radius.XS,
  },
  inactiveDot: {
    height: 4,
    width: 4,
    borderRadius: Radius.XS,
  },
  paginationPinkContainer: {
    flexDirection: 'row',
  },
  paginationWhiteContainer: {
    flexDirection: 'row',
    padding: Spacing.XS,
    borderRadius: Radius.S,
    backgroundColor: Colors.black_02 + '33',
  },
  paginationNumberContainer: {
    paddingHorizontal: Spacing.S,
    borderRadius: Radius.L,
    backgroundColor: Colors.black_02 + '33',
  },
  scrollContainer: {
    alignItems: 'center',
    width: '100%',
  },
  scrollView: {
    marginBottom: Spacing.L,
  },

  indicator: {
    width: 24,
    height: 4,
    borderRadius: Radius.XS,
  },
  indicatorContainer: {
    width: 72,
    height: 4,
    borderRadius: Radius.XS,
  },
});
