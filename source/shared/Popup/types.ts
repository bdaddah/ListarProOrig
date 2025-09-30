import {ReactNode} from 'react';

export type PopupProps = {
  /**
   * `image`: Optional. Represents the URL or path of the image to be displayed in the Popup component.
   */
  image?: string;

  /**
   * `title`: Represents the title text to be displayed in the Popup component.
   */
  title: string;

  /**
   * `description`: Represents the description text to be displayed in the Popup component.
   */
  description: string | ReactNode;

  /**
   * `information`: Optional. Represents additional information text to be displayed in the Popup component.
   */
  information?: string;

  /**
   * `secondary`: Optional. Represents the secondary action that can be performed from the Popup component.
   */
  secondary?: PopupAction;

  /**
   * `primary`: Represents the primary action that can be performed from the Popup component.
   */
  primary: PopupAction;

  /**
   * `buttonDirection`: Optional. Represents the direction in which the action buttons are laid out.
   * - 'row': Buttons are laid out horizontally.
   * - 'column': Buttons are laid out vertically.
   * - 'auto': The layout is automatically determined by title length.
   */
  buttonDirection?: PopupActionDirection;
};

type PopupAction = {
  /**
   * `title`: Represents the title text of the action button.
   */
  title: string;

  /**
   * `onPress`: A callback function that is called when the action button is pressed.
   */
  onPress: () => void;
};

type PopupActionDirection = 'row' | 'column' | 'auto';
