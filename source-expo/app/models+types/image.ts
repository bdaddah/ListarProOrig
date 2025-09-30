class ImageModel {
  id: number;
  full: string;
  thumb: string;

  constructor(data: any) {
    this.id = data.id;
    this.full = data.full;
    this.thumb = data.thumb;
  }

  static fromJson(json: any): ImageModel | undefined {
    try {
      return new ImageModel({
        id: json.id ?? 0,
        full: json.full?.url ?? '',
        thumb: json.thumb?.url ?? '',
      });
    } catch (error: any) {
      console.log(error.message);
    }
  }

  static fromJsonUpload(json: any): ImageModel | undefined {
    try {
      return new ImageModel({
        id: json.id ?? 0,
        thumb: json.media_details?.sizes?.thumbnail?.source_url ?? '',
        full: json.media_details?.sizes?.full?.source_url ?? '',
      });
    } catch (error: any) {
      console.log(error.message);
    }
  }
}

export {ImageModel};
