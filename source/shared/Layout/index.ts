import {createContext} from 'react';
import {GridContextProps} from './types';

import Container from './Container';
import Item from './Item';
import ContainerList from './ContainerList';

const GridContext = createContext<GridContextProps>({
  numberOfColumns: 12,
  gutter: 12,
  sizePerSpan: 0,
  getSizeSpan: span => span,
});

export {GridContext, Container, ContainerList, Item};
