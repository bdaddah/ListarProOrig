import {ImageModel} from './image';
import {CategoryModel} from './category';
import {UserModel} from './user';

class BlogModel {
  id: number;
  title: string;
  image?: ImageModel;
  category: CategoryModel[];
  createDate?: number;
  status: string;
  description: string;
  numComments: number;
  author?: UserModel;
  link: string;

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.image = data.image;
    this.category = data.category;
    this.createDate = data.createDate;
    this.status = data.status;
    this.description = data.description;
    this.numComments = data.numComments;
    this.author = data.author;
    this.link = data.link;
  }

  static fromJson(json: any): BlogModel | undefined {
    try {
      let category: CategoryModel[] = [];
      if (json.categories != null) {
        category = json.categories.map((item: any) => {
          return CategoryModel.fromJson(item);
        });
      }

      return new BlogModel({
        id: parseInt(`${json.ID}`, 10) || 0,
        title: json?.post_title || '',
        image: ImageModel.fromJson(json.image),
        category: category,
        createDate: Date.parse(json.post_date),
        status: json.post_status || '',
        description: json.post_content || json.post_excerpt || '',
        numComments: parseInt(json.comment_count, 10) || 0,
        author: UserModel.fromJson(json.author),
        link: json.guid || '',
      });
    } catch (e: any) {
      console.log(e.toString());
    }
  }

  toJson(): any {
    return {
      ID: this.id,
      post_title: this.title,
      image: {
        id: 0,
        full: {},
        thumb: {},
      },
    };
  }
}

export {BlogModel};
