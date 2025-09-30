import {Context, Theme} from '../Application/types';
import {Colors} from './colors+spacing+radius';

const defaultTheme: Theme = {
  dark: false,
  colors: {
    primary: {
      default: Colors.gold_03,
      light: Colors.gold_07,
      container: Colors.gold_09,
    },
    secondary: {
      default: Colors.mint_03,
      light: Colors.mint_07,
      container: Colors.mint_08,
    },
    background: {
      default: '#f2f2f6',
      surface: Colors.white,
      disable: Colors.black_12,
    },
    text: {
      default: Colors.black_03,
      secondary: Colors.black_05,
      hint: Colors.black_08,
      disable: Colors.black_12,
    },
    border: {
      default: Colors.black_12,
      disable: Colors.black_18,
    },
    success: {
      default: Colors.green_03,
      light: Colors.green_07,
      container: Colors.green_08,
    },
    warning: {
      default: Colors.orange_03,
      light: Colors.orange_07,
      container: Colors.orange_08,
    },
    error: {
      default: Colors.red_03,
      light: Colors.red_07,
      container: Colors.red_08,
    },
  },
  font: 'SFProText',
  assets: {},
};

const defaultDarkTheme: Theme = {
  dark: true,
  colors: {
    primary: {
      default: Colors.blue_03,
      light: Colors.blue_07,
      container: Colors.blue_09,
    },
    secondary: {
      default: Colors.mint_03,
      light: Colors.mint_07,
      container: Colors.mint_08,
    },
    background: {
      default: Colors.black,
      surface: '#1e1e1e',
      disable: '#303030',
    },
    text: {
      default: '#FFFFFA',
      secondary: '#b0b0b0',
      hint: '#727272',
      disable: '#505050',
    },
    border: {
      default: Colors.black_03,
      disable: Colors.black_02,
    },
    success: {
      default: Colors.green_03,
      light: Colors.green_07,
      container: Colors.green_08,
    },
    warning: {
      default: Colors.orange_03,
      light: Colors.orange_07,
      container: Colors.orange_08,
    },
    error: {
      default: Colors.red_03,
      light: Colors.red_07,
      container: Colors.red_08,
    },
  },
  font: 'SFProText',
  assets: {},
};

const defaultContext: Context = {
  theme: defaultTheme,
  navigator: undefined,
  translate: (key: string) => key,
};

export {defaultContext, defaultTheme, defaultDarkTheme};
