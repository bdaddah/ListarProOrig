import {
  ProductModel,
  WidgetDirection,
  WidgetModel,
  WidgetType,
} from '@models+types';
import {ListingWidget, ProductViewType} from '@components';
import React from 'react';

/**
 * Model for listing widget
 */
class ListingWidgetModel extends WidgetModel {
  direction: WidgetDirection;
  layout: ProductViewType;
  items: ProductModel[];

  constructor(
    title: string,
    description: string,
    direction: WidgetDirection = WidgetDirection.vertical,
    layout: ProductViewType,
    items: ProductModel[],
  ) {
    super(title, description, WidgetType.listing);
    this.direction = direction;
    this.layout = layout;
    this.items = items;
  }

  static fromJson(json: any): ListingWidgetModel | undefined {
    try {
      let title = json.title ?? '';
      let description = json.description ?? '';
      if (json.hide_title) {
        title = '';
      }
      if (json.hide_desc) {
        description = '';
      }
      return new ListingWidgetModel(
        title,
        description,
        json.direction ?? WidgetDirection.vertical,
        json.layout ?? ProductViewType.list,
        json.data.map(ProductModel.fromJson),
      );
    } catch (e: any) {
      console.log(e.toString());
    }
  }

  build(): JSX.Element {
    return React.createElement(ListingWidget, this);
  }
}

export {ListingWidgetModel};
