import {
  CategoryModel,
  FileModel,
  GPSModel,
  ImageModel,
  OpenTimeModel,
  UserModel,
} from '@models+types';
import {settingSelect, store} from '@redux';

class ProductModel {
  id: number;
  title: string;
  image: ImageModel;
  videoURL: string;
  category?: CategoryModel;
  createDate?: number;
  dateEstablish?: number;
  rate: number;
  numRate: number;
  rateText: string;
  status: string;
  favorite: boolean;
  useClaim: boolean;
  claimVerified?: boolean;
  address: string;
  zipCode: string;
  phone: string;
  fax: string;
  email: string;
  website: string;
  description: string;
  color: string;
  icon: string;
  tags: CategoryModel[];
  priceMin: string;
  priceMax: string;
  priceDisplay: string;
  country?: CategoryModel;
  city?: CategoryModel;
  state?: CategoryModel;
  author?: UserModel;
  galleries: ImageModel[];
  features: CategoryModel[];
  related: ProductModel[];
  latest: ProductModel[];
  openHours: OpenTimeModel[];
  socials: Record<string, any>;
  gps?: GPSModel;
  attachments: FileModel[];
  link: string;
  bookingStyle: string;

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.image = data.image;
    this.videoURL = data.videoURL;
    this.category = data.category;
    this.createDate = data.createDate;
    this.dateEstablish = data.dateEstablish;
    this.rate = data.rate;
    this.numRate = data.numRate;
    this.rateText = data.rateText;
    this.status = data.status;
    this.favorite = data.favorite;
    this.useClaim = data.useClaim;
    this.claimVerified = data.claimVerified;
    this.address = data.address;
    this.zipCode = data.zipCode;
    this.phone = data.phone;
    this.fax = data.fax;
    this.email = data.email;
    this.website = data.website;
    this.description = data.description;
    this.color = data.color;
    this.icon = data.icon;
    this.tags = data.tags;
    this.priceMin = data.priceMin;
    this.priceMax = data.priceMax;
    this.priceDisplay = data.priceDisplay;
    this.country = data.country;
    this.city = data.city;
    this.state = data.state;
    this.author = data.author;
    this.galleries = data.galleries;
    this.features = data.features;
    this.related = data.related;
    this.latest = data.latest;
    this.openHours = data.openHours;
    this.socials = data.socials;
    this.gps = data.gps;
    this.attachments = data.attachments;
    this.link = data.link;
    this.bookingStyle = data.bookingStyle;
  }

  static fromJson(json: any): ProductModel | undefined {
    try {
      const setting = settingSelect(store.getState());
      let galleries: ImageModel[] = [];
      let features: CategoryModel[] = [];
      let openHours: OpenTimeModel[] = [];
      let attachments: FileModel[] = [];
      let tags: CategoryModel[] = [];
      let socials: Record<string, any> = {};
      let author: UserModel | undefined;
      let category: CategoryModel | undefined;
      let gps: GPSModel | undefined;
      let country: CategoryModel | undefined;
      let state: CategoryModel | undefined;
      let city: CategoryModel | undefined;
      let status = '';
      let videoURL = '';
      let address = '';
      let phone = '';
      let fax = '';
      let email = '';
      let website = '';
      let dateEstablish;
      let priceMin = '';
      let priceMax = '';
      let priceDisplay = '';

      const image = ImageModel.fromJson(json.image || {full: {}, thumb: {}});

      if (json.author != null) {
        author = UserModel.fromJson(json.author);
      }

      if (json.category != null) {
        category = CategoryModel.fromJson(json.category);
      }

      if (json.location != null && json.location.country != null) {
        country = CategoryModel.fromJson(json.location.country);
      }

      if (json.location != null && json.location.state != null) {
        state = CategoryModel.fromJson(json.location.state);
      }

      if (json.location != null && json.location.city != null) {
        city = CategoryModel.fromJson(json.location.city);
      }

      if (json.latitude != null && setting?.useViewMap) {
        gps = GPSModel.fromJson({
          name: json.post_title ?? '',
          editable: false,
          longitude: json.longitude,
          latitude: json.latitude,
        });
      }

      if (setting?.useViewGalleries) {
        galleries = (json.galleries || []).map((item: any) =>
          ImageModel.fromJson(item),
        );
        if (galleries.length === 0 && image) {
          galleries.push(image);
        }
      }

      if (setting?.useViewStatus) {
        status = json.status ?? '';
      }
      // Always read post_status for My Listings and Admin moderation screens
      if (json.post_status) {
        status = json.post_status;
      }

      if (setting?.useViewVideo) {
        videoURL = json.video_url ?? '';
      }

      if (setting?.useViewAddress) {
        address = json.address ?? '';
      }

      if (setting?.useViewPhone) {
        phone = json.phone ?? '';
      }

      if (setting?.useViewFax) {
        fax = json.fax ?? '';
      }

      if (setting?.useViewEmail) {
        email = json.email ?? '';
      }

      if (setting?.useViewWebsite) {
        website = json.website ?? '';
      }

      if (setting?.useViewDateEstablish) {
        dateEstablish = Date.parse(json.date_establish);
      }

      if (setting?.useViewPrice) {
        priceMin = json.price_min ?? '';
        priceMax = json.price_max ?? '';
      }

      if (json.booking_use === true) {
        priceDisplay = json.booking_price_display ?? '';
      }

      if (setting?.useViewFeature) {
        features = (json.features || []).map((item: any) =>
          CategoryModel.fromJson(item),
        );
      }

      const listRelated = (json.related || []).map((item: any) =>
        ProductModel.fromJson(item),
      );
      const listLatest = (json.lastest || []).map((item: any) =>
        ProductModel.fromJson(item),
      );

      if (setting?.useViewOpenHours) {
        openHours = (json.opening_hour || []).map((item: any) =>
          OpenTimeModel.fromJson(item),
        );
      }

      if (setting?.useViewTags) {
        tags = (json.tags || []).map((item: any) =>
          CategoryModel.fromJson(item),
        );
      }

      if (setting?.useViewAttachment) {
        attachments = (json.attachments || []).map((item: any) =>
          FileModel.fromJson(item),
        );
      }

      if (setting?.useViewSocial && typeof json.social_network === 'object') {
        socials = json.social_network;
      }

      return new ProductModel({
        id: parseInt(json.ID, 10) || 0,
        title: json.post_title ?? '',
        image: image,
        videoURL: videoURL,
        category: category,
        createDate: Date.parse(json.post_date),
        dateEstablish: dateEstablish,
        rate: parseFloat(json.rating_avg) || 0.0,
        numRate: json.rating_count ?? 0,
        rateText: json.post_status ?? '',
        status: status,
        favorite: json.wishlist ?? false,
        useClaim: json.claim_use ?? true,
        claimVerified: json.claim_verified ?? false,
        address: address,
        zipCode: json.zip_code ?? '',
        phone: phone,
        fax: fax,
        email: email,
        website: website,
        description: json.post_excerpt ?? '',
        color: json.color ?? '',
        icon: json.icon ?? '',
        tags: tags,
        priceMin: priceMin,
        priceMax: priceMax,
        country: country,
        state: state,
        city: city,
        features: features,
        author: author,
        galleries: galleries,
        related: listRelated,
        latest: listLatest,
        openHours: openHours,
        socials: socials,
        gps: gps,
        attachments: attachments,
        link: json.guid ?? '',
        bookingStyle: json.booking_style ?? '',
        priceDisplay: priceDisplay,
      });
    } catch (e: any) {
      console.log(e.toString());
    }
  }
}

export {ProductModel};
