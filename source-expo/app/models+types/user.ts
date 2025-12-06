class UserModel {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  image: string;
  url: string;
  level: number;
  role: string;
  isAdmin: boolean;
  description: string;
  tag: string;
  rate: number;
  comment: number;
  total: number;
  token?: string;
  email: string;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.image = data.image;
    this.url = data.url;
    this.level = data.level;
    this.role = data.role;
    this.isAdmin = data.isAdmin;
    this.description = data.description;
    this.tag = data.tag;
    this.rate = data.rate;
    this.comment = data.comment;
    this.total = data.total;
    this.token = data.token;
    this.email = data.email;
  }

  static fromJson(json: any): UserModel | undefined {
    try {
      const level = json.user_level || 0;
      const role = json.role || 'user';
      const isAdmin = json.is_admin || role === 'admin' || level >= 10;

      return new UserModel({
        id: parseInt(`${json.id}`, 10) || 0,
        name: json.name || json.display_name || '',
        firstName: json.first_name || '',
        lastName: json.last_name || '',
        image: json.image || json.user_photo || '',
        url: json.url || json.user_url || '',
        level: level,
        role: role,
        isAdmin: isAdmin,
        description: json.description || '',
        tag: json.tag || '',
        rate: parseFloat(`${json.rating_avg}`) || 0.0,
        comment: parseInt(`${json.total_comment}`, 10) || 0,
        total: json.total || 0,
        token: json.token,
        email: json.email || json.user_email || '',
      });
    } catch (error: any) {
      console.log(error.message);
    }
  }
}

export {UserModel};
