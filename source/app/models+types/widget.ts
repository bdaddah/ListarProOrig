import {View} from 'react-native';
import React from 'react';

export enum WidgetType {
  listing = 'listing',
  category = 'category',
  banner = 'banner',
  slider = 'slider',
  admob = 'admob',
  post = 'post',
}

export enum WidgetDirection {
  horizontal = 'horizontal',
  vertical = 'vertical',
  grid = 'grid',
}

/**
 * Base class for all widget models
 */
abstract class WidgetModel {
  title: string;
  description: string;
  type: WidgetType;

  protected constructor(
    title: string,
    description: string,
    type: WidgetType = WidgetType.category,
  ) {
    this.title = title;
    this.description = description;
    this.type = type;
  }

  abstract build(): JSX.Element;
}

/**
 * Default widget model
 */
class DefaultWidgetModel extends WidgetModel {
  constructor(title: string, description: string) {
    super(title, description, WidgetType.banner);
  }

  static fromJson(json: any): DefaultWidgetModel {
    let title = json.title ?? '';
    let description = json.description ?? '';
    if (json.hide_title) {
      title = '';
    }
    if (json.hide_desc) {
      description = '';
    }
    return new DefaultWidgetModel(title, description);
  }

  build(): JSX.Element {
    return React.createElement(View, this);
  }
}

export {WidgetModel, DefaultWidgetModel};
