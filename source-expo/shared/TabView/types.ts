import {StyleProp, ViewProps, ViewStyle} from 'react-native';
import React, {ReactNode} from 'react';

export interface TabBarProps extends ViewProps {
  type?: 'default' | 'card';
  direction?: 'row' | 'column';
  tabs: TabBarItemProps[];
  initialIndex?: number;
  onPressTabItem?: (index: number) => void;
  tabBarStyles?: StyleProp<ViewStyle>;
  contentStyles?: StyleProp<ViewStyle>;
}

export type TabBarItemProps = {
  active?: boolean;
  type?: 'default' | 'card';
  direction?: 'row' | 'column';
  content?: React.ReactElement;
  label?: string;
  icon?: string | ReactNode;
  onPress?: () => void;
};
