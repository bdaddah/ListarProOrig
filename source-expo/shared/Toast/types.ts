export type ToastAction = {
  title: string;
  onPress: () => void;
};

export type ToastProps = {
  type?: 'success' | 'warning' | 'default';
  icon?: string;
  message: string;
  action?: ToastAction;
};
