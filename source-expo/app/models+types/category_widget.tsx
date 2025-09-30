import {CategoryWidget} from '@components';
import React from 'react';
import {
  CategoryModel,
  CategoryViewType,
  WidgetDirection,
  WidgetModel,
  WidgetType,
} from '@models+types';

/**
 * Model for category widget
 */
class CategoryWidgetModel extends WidgetModel {
  direction: WidgetDirection;
  layout: CategoryViewType;
  items: CategoryModel[];

  constructor(
    title: string,
    description: string,
    direction: WidgetDirection,
    layout: CategoryViewType,
    items: CategoryModel[],
  ) {
    super(title, description, WidgetType.category);
    this.direction = direction;
    this.layout = layout;
    this.items = items;
  }

  static fromJson(json: any): CategoryWidgetModel | undefined {
    try {
      let title = json.title ?? '';
      let description = json.description ?? '';
      if (json.hide_title) {
        title = '';
      }
      if (json.hide_desc) {
        description = '';
      }
      let layout = json.layout ?? CategoryViewType.iconCircle;
      if (json.direction === 'vertical') {
        layout = `${json.layout}-list`;
      }
      return new CategoryWidgetModel(
        title,
        description,
        json.direction ?? WidgetDirection.vertical,
        layout,
        json.data?.map((item: any) => {
          return CategoryModel.fromJson(item);
        }),
      );
    } catch (e: any) {
      console.log(e.toString());
    }
  }

  build(): JSX.Element {
    return React.createElement(CategoryWidget, this);
  }
}

export {CategoryWidgetModel};
