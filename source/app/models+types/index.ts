export * from './device';
export * from './image';
export * from './category';
export * from './setting';
export * from './sort';
export * from './product';
export * from './user';
export * from './open_time';
export * from './schedule';
export * from './gps';
export * from './file';
export * from './listing_creator';
export * from './pagination';
export * from './blog';
export * from './comment';
export * from './widget';
export * from './admob_widget';
export * from './banner_widget';
export * from './blog_widget';
export * from './category_widget';
export * from './listing_widget';
export * from './slider_widget';
export * from './filter';
export * from './rate_summary';
export * from './banner';
export * from './submit_setting';
export * from './booking_daily_style';
export * from './booking_hourly_style';
export * from './booking_slot_style';
export * from './booking_standard_style';
export * from './booking_style';
export * from './booking_table_style';
export * from './payment';
export * from './web';
export * from './payment_method';
export * from './bank_account';
export * from './booking';
export * from './booking_resource';
export * from './claim';

import {ResponseType} from 'axios';
import {store} from '@redux';
import {UnknownAction} from '@reduxjs/toolkit';

export type GetParams = {
  params?: Record<string, any>;
  headers?: Record<string, any>;
  responseType?: ResponseType;
  loading?: boolean;
  gps?: boolean;
};

export type PostParams = {
  params?: Record<string, any>;
  headers?: Record<string, any>;
  loading?: boolean;
  gps?: boolean;
  onProgress?: (percent: number) => void;
};

export type DownloadParams = {
  headers?: Record<string, any>;
  loading?: boolean;
  onProgress?: (percent: number) => void;
};

export type RootState = ReturnType<typeof store.getState>;

export interface Action extends UnknownAction {
  [key: string]: any;
}
