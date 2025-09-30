import {CategoryModel, SettingModel, SortModel} from '@models+types';

class FilterModel {
  keyword?: string;
  categories: CategoryModel[];
  features: CategoryModel[];
  country?: CategoryModel;
  city?: CategoryModel;
  state?: CategoryModel;
  distance?: number;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  sort?: SortModel;
  startHour?: string;
  endHour?: string;

  constructor(data: any) {
    this.keyword = data.keyword;
    this.categories = data.categories;
    this.features = data.features;
    this.country = data.country;
    this.city = data.city;
    this.state = data.state;
    this.distance = data.distance;
    this.minPrice = data.minPrice;
    this.maxPrice = data.maxPrice;
    this.color = data.color;
    this.sort = data.sort;
    this.startHour = data.startHour;
    this.endHour = data.endHour;
  }

  static fromSettings(setting: SettingModel) {
    return new FilterModel({
      categories: [],
      features: [],
      sort: setting?.sort?.[0],
      startHour: setting?.startHour,
      endHour: setting?.endHour,
    });
  }

  clone(): FilterModel {
    return new FilterModel({
      ...this,
      categories: [...this.categories],
      features: [...this.features],
    });
  }

  async getParams() {
    const params: any = {};
    params.category = this.categories.map?.(item => {
      return item.id;
    });
    params.feature = this.features.map?.(item => {
      return item.id;
    });
    if (this.keyword) {
      params.s = this.keyword;
    }
    if (this.country) {
      params.location = this.country.id;
    }
    if (this.city) {
      params.location = this.city.id;
    }
    if (this.state) {
      params.location = this.state.id;
    }
    if (this.distance) {
      params.distance = this.distance;
    }
    if (this.minPrice) {
      params.price_min = this.minPrice;
    }
    if (this.maxPrice) {
      params.price_max = this.maxPrice;
    }
    if (this.color) {
      params.color = this.color;
    }
    if (this.sort) {
      const sort = this.sort.value.split('/');
      params.orderby = sort[0];
      params.order = sort[1];
    }
    if (this.startHour) {
      params.start_time = this.startHour;
    }
    if (this.endHour) {
      params.end_time = this.endHour;
    }

    return params;
  }
}

export {FilterModel};
