import {UserModel} from '@models+types';

class CommentModel {
  id: number;
  user: UserModel;
  content: string;
  postName: string;
  createDate?: number;
  rate: number;

  constructor(data: any) {
    this.id = data.id;
    this.user = data.user;
    this.content = data.content;
    this.postName = data.postName;
    this.createDate = data.createDate;
    this.rate = data.rate;
  }

  static fromJson(json: any) {
    try {
      return new CommentModel({
        id: json.comment_ID ?? 0,
        user: UserModel.fromJson({
          id: json.user_id ?? 0,
          user_email: json.comment_author_email,
          display_name: json.comment_author,
          user_photo: json.comment_author_image,
        }),
        postName: json.post_title ?? '',
        content: json.comment_content ?? '',
        createDate: Date.parse(json.comment_date),
        rate: parseFloat(json.rate ?? '0'),
      });
    } catch (error: any) {
      console.log(error.toString());
    }
  }
}

export {CommentModel};
