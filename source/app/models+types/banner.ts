import {ImageModel} from '@models+types';

class BannerModel {
  link: string;
  image: ImageModel;

  constructor(data: any) {
    this.link = data.link;
    this.image = data.image;
  }

  static fromJson(json: any): BannerModel | undefined {
    try {
      return new BannerModel({
        link: json.url ?? '',
        image: ImageModel.fromJson(json.image),
      });
    } catch (e: any) {
      console.log(e.toString());
    }
  }
}

export {BannerModel};
