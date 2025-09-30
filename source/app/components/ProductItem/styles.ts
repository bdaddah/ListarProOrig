import {StyleSheet} from 'react-native';
import {Radius, Spacing} from '@passionui/components';

export default StyleSheet.create({
  /**
   * card
   */
  cardContainer: {
    borderRadius: Radius.M,
    height: 160,
    width: '100%',
    overflow: 'hidden',
  },
  titleCard: {
    position: 'absolute',
    left: 8,
    bottom: 8,
  },

  /**
   * small
   */
  smallImage: {width: 90, height: 90, borderRadius: 12},

  /**
   * list
   */
  listImage: {width: 120, height: 140, borderRadius: 12},
  favorite: {position: 'absolute', bottom: 0, right: 0},
  status: {
    borderRadius: Radius.S,
    paddingVertical: Spacing.XXS,
    paddingHorizontal: Spacing.S,
    flexDirection: 'row',
  },

  /**
   * block vs card-full
   */
  blockImage: {height: 200, width: '100%', borderRadius: Radius.M},
  blockFavorite: {position: 'absolute', top: 8, right: 8},
  blockRate: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    alignItems: 'flex-end',
  },
  cardInfo: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    alignItems: 'flex-start',
  },
  /**
   * grid
   */
  gridImage: {height: 120, borderRadius: 12, width: '100%'},
  gridFavorite: {position: 'absolute', bottom: 8, right: 8},
});
