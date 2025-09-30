import {ViewProps} from 'react-native';

export type GridContextProps = {
  /**
   * Represents the number of columns in the grid.
   */
  numberOfColumns: number;

  /**
   * Represents the size of the gutter between grid items.
   */
  gutter: number;

  /**
   * Represents the size (width or height) per span number.
   */
  sizePerSpan: number;

  /**
   * A function that receives a span number and returns the calculated size for that span.
   */
  getSizeSpan: (span: number) => number;
};

export interface ContainerProps extends ViewProps {
  gutter?: number;
  margin?: number;
  padding?: number;
  backgroundImage?: string;
}

export interface ItemProps extends ViewProps {
  /**
   * Represents the width of the Card component in terms of span numbers (1-12).
   */
  widthSpan?: number;

  /**
   * Optional. Represents the height of the Card component in terms of span numbers (1-12).
   */
  heightSpan?: number;
}
