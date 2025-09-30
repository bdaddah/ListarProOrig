import {BannerWidget} from '@components';
import {BannerModel, WidgetModel, WidgetType} from '@models+types';
import React from 'react';

/**
 * Model for banner widget
 */
class BannerWidgetModel extends WidgetModel {
  item?: BannerModel;

  constructor(title: string, description: string, item?: BannerModel) {
    super(title, description, WidgetType.banner);
    this.item = item;
  }

  static fromJson(json: any): BannerWidgetModel | undefined {
    try {
      let title = json.title ?? '';
      let description = json.description ?? '';
      if (json.hide_title) {
        title = '';
      }
      if (json.hide_desc) {
        description = '';
      }
      return new BannerWidgetModel(
        title,
        description,
        BannerModel.fromJson(json.data),
      );
    } catch (e: any) {
      console.log(e.toString());
    }
  }

  build(): JSX.Element {
    return React.createElement(BannerWidget, this);
  }
}

export {BannerWidgetModel};
