import {BannerModel, WidgetModel, WidgetType} from '@models+types';
import React from 'react';
import {SliderWidget} from '@components';

/**
 * Model for slider widget
 */
class SliderWidgetModel extends WidgetModel {
  items: BannerModel[];

  constructor(title: string, description: string, items: BannerModel[]) {
    super(title, description, WidgetType.slider);
    this.items = items;
  }

  static fromJson(json: any): SliderWidgetModel | undefined {
    try {
      let title = json.title ?? '';
      let description = json.description ?? '';
      if (json.hide_title) {
        title = '';
      }
      if (json.hide_desc) {
        description = '';
      }
      return new SliderWidgetModel(
        title,
        description,
        json.data?.map((item: any) => {
          return BannerModel.fromJson(item);
        }),
      );
    } catch (e: any) {
      console.log(e.toString());
    }
  }

  build(): JSX.Element {
    return React.createElement(SliderWidget, this);
  }
}

export {SliderWidgetModel};
