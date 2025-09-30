class FileModel {
  name: string;
  type: string;
  url: string;
  size: string;

  constructor(data: any) {
    this.name = data.name;
    this.type = data.type;
    this.url = data.url;
    this.size = data.size;
  }

  static fromJson(json: any): FileModel | undefined {
    const arrayName = json.name.split('.');
    return new FileModel({
      name: arrayName[0],
      type: arrayName[1],
      url: json.url,
      size: json.size,
    });
  }
}

export {FileModel};
