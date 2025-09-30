import {ScrollView, ScrollViewProps, ViewStyle} from 'react-native';
import {Ref} from 'react';

export type PaginationProps = {
  /**
   * Optional. Defines the visual style of the Pagination component.
   * - 'default': Represents the default style.
   * - 'black_white': Represents a pagination that have black background.
   * - 'number': Represents a style where pages are represented by numbers.
   * - 'scroll': Represents a scrollable style.
   */
  type?: 'default' | 'black_white' | 'number' | 'scroll';

  /**
   * Represents the currently active (selected) index in the Pagination component.
   */
  activeIndex: number;

  /**
   * Represents the total number of items (pages) in the Pagination component.
   */
  dataLength: number;
};

export type DotProps = {
  active: boolean;
  style: ViewStyle | ViewStyle[];
};

export interface ScrollIndicatorProps extends ScrollViewProps {
  /**
   * Optional. Represents a reference to the ScrollView component.
   * It can be used to access the instance methods of the ScrollView.
   */
  scrollViewRef?: Ref<ScrollView>;
}

export type ChildPaginationProps = Omit<PaginationProps, 'type'>;
