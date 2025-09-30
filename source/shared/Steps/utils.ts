import {Typography, Theme, FontWeight} from '../index';

type StepStatus = 'inactive' | 'active' | 'completed' | 'error';
type StepTypo = {
  typography: Typography;
  fontWeight?: FontWeight;
  color: string;
};

export const getStepTextStyle = (
  theme: Theme,
  activeIndex: number,
  currentIndex: number,
  error?: boolean,
  size?: 'small' | 'large',
) => {
  let title: StepTypo = {
    color: theme.colors.text.default,
    fontWeight: 'semibold',
    typography: 'caption1',
  };
  let description: StepTypo = {
    color: theme.colors.text.default,
    typography: 'caption2',
  };
  let time: StepTypo = {
    color: theme.colors.text.default,
    typography: 'caption2',
  };

  let status: StepStatus = 'inactive';
  if (activeIndex > currentIndex) {
    status = 'completed';
  }
  if (activeIndex === currentIndex) {
    status = 'active';
  }
  if (error) {
    status = 'error';
  }

  switch (status) {
    case 'active': {
      title.fontWeight = 'bold';
      break;
    }

    case 'completed': {
      title.color = theme.colors.text.hint;
      description.color = theme.colors.text.hint;
      time.color = theme.colors.text.hint;
      break;
    }

    case 'error': {
      title.color = theme.colors.error.default;
      title.fontWeight = 'bold';
      break;
    }
  }

  if (size === 'small') {
    description.typography = 'caption2';
  }

  return {title, description, time};
};

export const getStepColor = (
  theme: Theme,
  activeIndex: number,
  currentIndex: number,
  error?: boolean,
  length: number = 1,
) => {
  const DEFAULT_LINE_COLOR = theme.colors.background.disable;
  const COMPLETED_LINE_COLOR = theme.colors.primary.light;

  let backgroundColor = theme.colors.background.disable;
  let borderColor = theme.colors.border.default;
  let lineColorLeft = DEFAULT_LINE_COLOR;
  let lineColorRight = DEFAULT_LINE_COLOR;
  let status: StepStatus = 'inactive';

  if (activeIndex > currentIndex) {
    status = 'completed';
    lineColorLeft = COMPLETED_LINE_COLOR;
    lineColorRight = COMPLETED_LINE_COLOR;
  }
  if (activeIndex === currentIndex) {
    status = 'active';
    lineColorLeft = COMPLETED_LINE_COLOR;
  }
  if (error) {
    status = 'error';
  }

  if (currentIndex === 0) {
    lineColorLeft = 'transparent';
  }
  if (currentIndex === length - 1) {
    lineColorRight = 'transparent';
  }

  switch (status) {
    case 'active': {
      backgroundColor = theme.colors.primary.default;
      borderColor = theme.colors.primary.light;
      break;
    }

    case 'completed': {
      backgroundColor = theme.colors.primary.default;
      borderColor = theme.colors.primary.light;
      break;
    }

    case 'error': {
      backgroundColor = theme.colors.error.default;
      borderColor = theme.colors.error.light;
      break;
    }
  }

  return {backgroundColor, borderColor, lineColorLeft, lineColorRight};
};
