import React from 'react';

export type PropValue = {
  value: any;
  type: 'string' | 'enum' | 'bool' | 'number' | 'object';
  data?: any;
};
export type PlaygroundProps = {
  component: React.ElementType;
  data: {[key: string]: PropValue};
};
