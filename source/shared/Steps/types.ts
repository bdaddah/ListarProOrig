/**
 * Properties for the Steps component, a guided progress through a sequence of procedural steps.
 */
export type StepsProps = {
  /**
   * Optional. If `true`, the steps are laid out in a horizontal manner.
   * If `false`, the steps are laid out vertically.
   * Defaults to `false` (vertical) if not provided.
   */
  direction?: 'horizontal' | 'vertical';

  /**
   * An array of `Step` items representing each individual step in the sequence.
   * Each `Step` has its own set of properties such as title, description, etc.
   */
  steps: Step[];

  /**
   * Optional. Specifies the size of the steps. Affects all step items within the component.
   * If not provided, a default size is used.
   */
  size?: 'small' | 'large';

  /**
   * The index of the currently active step within the steps sequence,
   * starting from 0 for the first step.
   */
  activeIndex: number;
};

/**
 * Represents a single step within the Steps component. Each step has a
 * title and can have optional properties such as a description or error state.
 */
export type Step = {
  /**
   * The title of the step, briefly describing the purpose or task of this stage.
   */
  title: string;

  /**
   * Optional. An icon representing this step. It can be used to provide a visual
   */
  icon?: string;

  /**
   * Optional. More detailed text about this particular step.
   * It can provide users with guidance on what to expect or what's required.
   */
  description?: string;

  /**
   * Optional. If `true`, the step is marked as having an error, typically displayed
   * with an error icon and error styles. Defaults to `false` if not provided.
   */
  error?: boolean;

  /**
   * Optional. A string representing the time associated with this step.
   * It could be the duration, a specific time, or date, depending on the context.
   */
  time?: string;
};
