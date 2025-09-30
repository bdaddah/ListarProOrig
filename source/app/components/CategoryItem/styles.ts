import {StyleSheet} from 'react-native';
import {Radius, Spacing} from '@passionui/components';

export default StyleSheet.create({
  card: {
    borderRadius: Radius.M,
    height: 160,
    width: 120,
    overflow: 'hidden',
  },
  titleCard: {
    position: 'absolute',
    left: 8,
    bottom: 8,
  },

  /**
   * icon-circle
   */
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /**
   * icon-round
   */
  iconRound: {
    width: 60,
    height: 60,
    borderRadius: Radius.M,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /**
   * icon-square
   */
  iconSquare: {
    aspectRatio: 1,
    width: '100%',
    padding: Spacing.M,
    borderRadius: Radius.M,
  },

  /**
   * icon-square
   */
  iconLandscape: {
    aspectRatio: 16 / 10,
    width: '100%',
    padding: Spacing.M,
    borderRadius: Radius.M,
  },

  /**
   * icon-portrait
   */
  iconPortrait: {
    aspectRatio: 3 / 4,
    width: '100%',
    padding: Spacing.M,
    borderRadius: Radius.M,
  },

  /**
   * icon-circle-list, icon-round-list,
   */
  listContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: Spacing.M,
    borderRadius: Radius.M,
  },

  /**
   * icon-square-list, icon-landscape-list, icon-portrait-list
   */
  listShapeContainer: {
    flexDirection: 'row',
    padding: Spacing.M,
    borderRadius: Radius.M,
    height: 120,
    width: '100%',
  },

  /**
   * image-circle
   */
  imageCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /**
   * image-round
   */
  imageRound: {
    width: 60,
    height: 60,
    borderRadius: Radius.M,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /**
   * image-square
   */
  imageSquare: {
    aspectRatio: 1,
    width: '100%',
    borderRadius: Radius.M,
    height: undefined,
  },

  /**
   * image-square
   */
  imageLandscape: {
    aspectRatio: 16 / 10,
    width: '100%',
    height: undefined,
    borderRadius: Radius.M,
  },

  /**
   * image-portrait
   */
  imagePortrait: {
    aspectRatio: 3 / 4,
    width: '100%',
    height: undefined,
    borderRadius: Radius.M,
  },

  /**
   * full style
   */
  fullContainer: {
    flexDirection: 'row',
    height: 120,
    width: '100%',
  },
  fullImage: {
    width: '100%',
    height: '100%',
    borderRadius: Radius.M,
  },
});
