import React from 'react';
import {ScreenContainerProps} from '@passionui/components';
import {useSelector} from 'react-redux';
import {settingSelect} from '@redux';
import {ListingCreator, SettingModel} from '@models+types';

const ProductDetail: React.FC<ScreenContainerProps> = props => {
  const setting = useSelector(settingSelect) ?? SettingModel.fromDefault();
  const factory = new ListingCreator(setting.layout).create();
  const Component = factory?.createProductDetail();

  return <Component {...props} />;
};

export {ProductDetail};
