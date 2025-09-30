class GPSModel {
  name?: string;
  editable: boolean;
  longitude: number;
  latitude: number;

  constructor(data: any) {
    this.name = data.name;
    this.editable = data.editable ?? false;
    this.longitude = data.longitude;
    this.latitude = data.latitude;
  }

  toView() {
    return `(${this.latitude}, ${this.longitude})`;
  }

  static fromJson(json: any): GPSModel | undefined {
    return new GPSModel({
      name: json.name,
      editable: json.editable,
      longitude: parseFloat(json.longitude) || 0.0,
      latitude: parseFloat(json.latitude) || 0.0,
    });
  }
}

export {GPSModel};
