import {ImageModel} from '@models+types';

enum CategoryType {
  category = 'listar_category',
  location = 'listar_location',
  feature = 'listar_feature',
}

enum CategoryViewType {
  iconCircle = 'icon-circle',
  iconCircleList = 'icon-circle-list',
  iconRound = 'icon-round',
  iconRoundList = 'icon-round-list',
  iconSquare = 'icon-square',
  iconSquareList = 'icon-square-list',
  iconLandscape = 'icon-landscape',
  iconLandscapeList = 'icon-landscape-list',
  iconPortrait = 'icon-portrait',
  iconPortraitList = 'icon-portrait-list',
  imageCircle = 'image-circle',
  imageCircleList = 'image-circle-list',
  imageRound = 'image-round',
  imageRoundList = 'image-round-list',
  imageSquare = 'image-square',
  imageSquareList = 'image-square-list',
  imageLandscape = 'image-landscape',
  imageLandscapeList = 'image-landscape-list',
  imagePortrait = 'image-portrait',
  imagePortraitList = 'image-portrait-list',
  card = 'card',
  full = 'full',
}

class CategoryModel {
  id: number;
  title: string;
  count?: number;
  image?: ImageModel;
  icon?: string;
  color?: string;
  type: CategoryType;
  hasChild: boolean;

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.count = data.count;
    this.image = data.image;
    this.icon = data.icon;
    this.color = data.color;
    this.type = data.type ?? CategoryType.category;
    this.hasChild = data.hasChild ?? false;
  }

  static fromJson(json: any): CategoryModel | undefined {
    try {
      let image: ImageModel | undefined;
      if (json.image) {
        image = ImageModel.fromJson(json.image);
      }
      const icon = json.icon ?? '';
      const color = json.color;
      return new CategoryModel({
        id: json.term_id ?? json.id ?? 0,
        title: json.name ?? '',
        count: json.count ?? 0,
        image: image,
        icon: icon,
        color: color,
        type: json.taxonomy as CategoryType,
        hasChild: json.has_child ?? false,
      });
    } catch (error: any) {
      console.log(error.message);
    }
  }
}

export {CategoryModel, CategoryType, CategoryViewType};
