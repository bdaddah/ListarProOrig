import {
  BlogModel,
  WidgetDirection,
  WidgetModel,
  WidgetType,
} from '@models+types';
import React from 'react';
import {BlogViewType, BlogWidget} from '@components';

/**
 * Model for blog widget
 */
class BlogWidgetModel extends WidgetModel {
  direction: WidgetDirection;
  layout: BlogViewType;
  items: BlogModel[];

  constructor(
    title: string,
    description: string,
    direction: WidgetDirection = WidgetDirection.vertical,
    layout: BlogViewType,
    items: BlogModel[],
  ) {
    super(title, description, WidgetType.listing);
    this.direction = direction;
    this.layout = layout;
    this.items = items;
  }

  static fromJson(json: any): BlogWidgetModel | undefined {
    try {
      let title = json.title ?? '';
      let description = json.description ?? '';
      if (json.hide_title) {
        title = '';
      }
      if (json.hide_desc) {
        description = '';
      }
      return new BlogWidgetModel(
        title,
        description,
        json.direction ?? WidgetDirection.vertical,
        json.layout ?? BlogViewType.list,
        json.data.map(BlogModel.fromJson),
      );
    } catch (e: any) {
      console.log(e.toString());
    }
  }

  build(): JSX.Element {
    return React.createElement(BlogWidget, this);
  }
}

export {BlogWidgetModel};
