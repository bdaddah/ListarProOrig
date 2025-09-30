import {
  Animated,
  ImageSourcePropType,
  ScrollViewProps,
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native';
import React, {ReactNode} from 'react';
import Navigator from './Navigator';
import {
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {HeaderButtonProps} from '@react-navigation/elements';
import {BottomTabNavigationOptions} from '@react-navigation/bottom-tabs';
import {ToastProps} from '../index';
import {Edges} from 'react-native-safe-area-context';
import {Localization} from '../Localization';

export type RootStackParamList = {
  Stack: {
    [key: string]: any;
    screen: React.FC<ScreenContainerProps>;
  };
  Dialog: {
    [key: string]: any;
    screen: React.FC<ScreenContainerProps>;
  };
  Modal: {
    [key: string]: any;
    screen: React.FC<ScreenContainerProps>;
    onDismiss?: () => void;
    barrierDismissible?: boolean;
  };
};

export type Theme = {
  dark: boolean;
  colors: {
    primary: {
      default: string;
      light: string;
      container: string;
    };
    secondary: {
      default: string;
      light: string;
      container: string;
    };
    background: {
      default: string;
      surface: string;
      disable: string;
    };
    text: {
      default: string;
      secondary: string;
      hint: string;
      disable: string;
    };
    border: {
      default: string;
      disable: string;
    };
    success: {
      default: string;
      light: string;
      container: string;
    };
    warning: {
      default: string;
      light: string;
      container: string;
    };
    error: {
      default: string;
      light: string;
      container: string;
    };
  };
  font: string;
  assets?: {
    headerBackground?: ImageSourcePropType;
  };
};

export type Context = {
  theme: Theme;
  navigator?: Navigator;
  translate: (key: string) => string;
};

export type NavigationContainerProps = {
  navigator: Navigator;
  screen: React.FC<ScreenContainerProps>;
  theme: Theme;
  params?: {string: any};
  localization: Localization;
};

export type ScreenContainerProps = {
  [key: string]: any;
  navigation?: NativeStackNavigationProp<any> | undefined;
};

export type ScreenParams<T extends ScreenContainerProps> = {
  [key: string]: any;
  screen: React.FC<T>;
};

export interface ModalParams extends ScreenParams<ScreenContainerProps> {
  onDismiss?: () => void;
  barrierDismissible?: boolean;
}

export interface BottomSheetParams extends ScreenParams<ScreenContainerProps> {
  backgroundColor?: string;
  title: string;
  snapPoint?: 'content' | 'automatic' | '30%' | '50%' | '90%';
  onClose?: () => void;
  onDismiss?: () => void;
}

export interface NavigationButtonProps extends HeaderButtonProps {
  icon: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export type ToolkitItem = {
  title: string;
  onPress: () => void;
};

export type NavigationToolkitProps = {
  tintColor?: string;
  actions?: ToolkitItem[];
};

export type HeaderBackgroundProps = {
  surface?: boolean;
  animatedValue?: Animated.Value;
};

export interface BottomTabItemProps extends BottomTabNavigationOptions {
  name: string;
  icon: string;
  screen: React.ComponentType;
  options?: NativeStackNavigationOptions;
  initialParams?: any;
}

export type BottomTabProps = {
  initialRouteName?: string;
  nested?: boolean;
  tabs: BottomTabItemProps[];
  navigation: NativeStackNavigationProp<any> | undefined;
};

export type HeaderType = 'default' | 'surface' | 'extended' | 'none';

export interface ScreenProps extends ViewProps {
  /**
   * Navigation of react-navigation.
   */
  navigation: NativeStackNavigationProp<any> | undefined;

  /**
   * Navigation options of react-navigation.
   */
  options?: NativeStackNavigationOptions;

  /**
   * Optional. If `true`, enable keyboard avoiding view for the screen.
   */
  enableKeyboardAvoidingView?: boolean;

  /**
   * Optional. If `true`, the screen content is scrollable.
   */
  scrollable?: boolean;

  /**
   * Optional. Edges for the screen.
   */
  edges?: Edges;

  /**
   * Optional. default header image gradient for header.
   */
  headerType?: HeaderType;
  /**
   * Optional. Props for the animated component or bool used top navigation animated.
   */
  animatedHeader?: AnimatedHeader;

  /**
   * Optional. Props for the underlying ScrollView component when `scrollable` is `true`.
   */
  scrollViewProps?: ScrollViewProps;

  /**
   * Optional. ReactNode representing the header component of the screen.
   */
  headerComponent?: ReactNode;

  /**
   * Optional. ReactNode representing the footer component of the screen.
   */
  footerComponent?: ReactNode;

  /**
   * Optional. ReactNode representing the floating component of the screen.
   */
  floatingComponent?: ReactNode;

  /**
   * Optional. layout card offset overlap header banner.
   */
  layoutOffset?: -8 | -24 | -56;

  /**
   * Optional. background for the screen.
   */
  backgroundColor?: string;

  /**
   * Optional. animated value for the screen.
   */
  animatedValue?: Animated.Value;
}

export type AnimatedHeader = {
  type: 'default' | 'surface';
  component?: (props?: any) => React.ReactElement;
};

export type LoadingParams = {
  title?: string;
  message?: string;
  duration?: number;
};

export interface ToastParams extends ToastProps {
  onDismiss?: () => void;
  position?: number;
  duration?: number;
}
