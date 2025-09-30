import {CategoryModel, SortModel} from '@models+types';

enum ProductViewType {
  list = 'list',
  grid = 'grid',
  block = 'block',
  small = 'small',
  card = 'card',
}

class SettingModel {
  layout: string;
  useLayoutWidget: boolean;
  category: CategoryModel[];
  features: CategoryModel[];
  locations: CategoryModel[];
  sort: SortModel[];
  perPage: number;
  listMode: ProductViewType;
  enableSubmit: boolean;
  minPrice: number;
  maxPrice: number;
  colors: string[];
  unit: string;
  startHour: string;
  endHour: string;
  useViewAddress: boolean;
  useViewPhone: boolean;
  useViewFax: boolean;
  useViewEmail: boolean;
  useViewWebsite: boolean;
  useViewSocial: boolean;
  useViewStatus: boolean;
  useViewDateEstablish: boolean;
  useViewGalleries: boolean;
  useViewAttachment: boolean;
  useViewVideo: boolean;
  useViewMap: boolean;
  useViewPrice: boolean;
  useViewOpenHours: boolean;
  useViewTags: boolean;
  useViewFeature: boolean;
  useViewAdmob: boolean;

  constructor(data: any) {
    this.layout = data.layout;
    this.useLayoutWidget = data.useLayoutWidget;
    this.category = data.category;
    this.features = data.features;
    this.locations = data.locations;
    this.sort = data.sort;
    this.perPage = data.perPage;
    this.listMode = data.listMode;
    this.enableSubmit = data.enableSubmit;
    this.minPrice = data.minPrice;
    this.maxPrice = data.maxPrice;
    this.colors = data.colors;
    this.unit = data.unit;
    this.startHour = data.startHour;
    this.endHour = data.endHour;
    this.useViewAddress = data.useViewAddress;
    this.useViewPhone = data.useViewPhone;
    this.useViewFax = data.useViewFax;
    this.useViewEmail = data.useViewEmail;
    this.useViewWebsite = data.useViewWebsite;
    this.useViewSocial = data.useViewSocial;
    this.useViewStatus = data.useViewStatus;
    this.useViewDateEstablish = data.useViewDateEstablish;
    this.useViewGalleries = data.useViewGalleries;
    this.useViewAttachment = data.useViewAttachment;
    this.useViewVideo = data.useViewVideo;
    this.useViewMap = data.useViewMap;
    this.useViewPrice = data.useViewPrice;
    this.useViewOpenHours = data.useViewOpenHours;
    this.useViewTags = data.useViewTags;
    this.useViewFeature = data.useViewFeature;
    this.useViewAdmob = data.useViewAdmob;
  }

  static fromDefault(): SettingModel {
    return new SettingModel({
      layout: 'basic',
      useLayoutWidget: false,
      category: [],
      features: [],
      locations: [],
      sort: [],
      perPage: 20,
      listMode: ProductViewType.list,
      enableSubmit: true,
      minPrice: 0.0,
      maxPrice: 100.0,
      colors: [],
      unit: 'USD',
      startHour: '08:00',
      endHour: '18:00',
      useViewAddress: true,
      useViewPhone: true,
      useViewFax: true,
      useViewEmail: true,
      useViewWebsite: true,
      useViewSocial: true,
      useViewStatus: true,
      useViewDateEstablish: true,
      useViewGalleries: true,
      useViewAttachment: true,
      useViewVideo: true,
      useViewMap: true,
      useViewPrice: true,
      useViewOpenHours: true,
      useViewTags: true,
      useViewFeature: true,
      useViewAdmob: true,
    });
  }

  static fromJson(json: any): SettingModel | undefined {
    try {
      let startHour: string | undefined;
      let endHour: string | undefined;

      const settings = json.settings || {};
      const viewOptions = json.view_option || {};
      if (settings.time_min != null) {
        const split = settings.time_min.split(':');
        startHour = `${split[0]}:${split[1]}`;
      }

      if (settings.time_max != null) {
        const split = settings.time_max.split(':');
        endHour = `${split[0]}:${split[1]}`;
      }

      const layout = settings.layout_mode || 'basic';

      return new SettingModel({
        layout,
        useLayoutWidget: settings.layout_widget || false,
        category: (json.categories || []).map((e: any) =>
          CategoryModel.fromJson(e),
        ),
        features: (json.features || []).map((e: any) =>
          CategoryModel.fromJson(e),
        ),
        locations: (json.locations || []).map((e: any) =>
          CategoryModel.fromJson(e),
        ),
        sort: (json.place_sort_option || []).map((item: any) =>
          SortModel.fromJson(item),
        ),
        perPage: settings.per_page || 20,
        listMode: settings.list_mode || ProductViewType.list,
        enableSubmit: settings.submit_listing ?? true,
        minPrice: parseFloat(settings.price_min) || 0.0,
        maxPrice: parseFloat(settings.price_max) || 100.0,
        colors: settings.color_option || [],
        unit: settings.unit_price || 'USD',
        startHour: startHour || '08:00',
        endHour: endHour || '15:00',
        useViewAddress: viewOptions.view_address_use ?? true,
        useViewPhone: viewOptions.view_phone_use ?? true,
        useViewFax: viewOptions.view_fax_use ?? true,
        useViewEmail: viewOptions.view_email_use ?? true,
        useViewWebsite: viewOptions.view_website_use ?? true,
        useViewSocial: viewOptions.social_network_use ?? true,
        useViewStatus: viewOptions.view_status_use ?? true,
        useViewDateEstablish: viewOptions.view_date_establish_use ?? true,
        useViewGalleries: viewOptions.view_galleries_use ?? true,
        useViewAttachment: viewOptions.view_attachment_use ?? true,
        useViewVideo: viewOptions.view_video_url_use ?? true,
        useViewMap: viewOptions.view_map_use ?? true,
        useViewPrice: viewOptions.view_price_use ?? true,
        useViewOpenHours: viewOptions.view_opening_hour_use ?? true,
        useViewTags: viewOptions.view_tags_use ?? true,
        useViewFeature: viewOptions.view_feature_use ?? true,
        useViewAdmob: viewOptions.view_admob_use ?? true,
      });
    } catch (e: any) {
      console.log(e.toString());
    }
  }
}

export {SettingModel};
