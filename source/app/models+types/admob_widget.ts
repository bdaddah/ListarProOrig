import {WidgetModel, WidgetType} from './widget';
import React from 'react';
import {AdmobWidget} from '@components';
import {Platform} from 'react-native';

/**
 * Model for blog widget
 */
class AdmobWidgetModel extends WidgetModel {
  id: string;

  constructor(id: string, title: string, description: string) {
    super(title, description, WidgetType.admob);
    this.id = id;
  }

  static fromJson(json: any): AdmobWidgetModel {
    const id = json.data[Platform.OS];
    let title = json.title ?? '';
    let description = json.description ?? '';
    if (json.hide_title) {
      title = '';
    }
    if (json.hide_desc) {
      description = '';
    }
    return new AdmobWidgetModel(id, title, description);
  }

  build(): JSX.Element {
    return React.createElement(AdmobWidget, this);
  }
}

export {AdmobWidgetModel};
