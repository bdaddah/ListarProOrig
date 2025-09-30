class SortModel {
  title: string;
  value: string;

  constructor(data: any) {
    this.title = data.title;
    this.value = data.value;
  }

  static fromJson(json: any): SortModel | undefined {
    try {
      return new SortModel({
        title: json.lang_key ?? '',
        value: `${json.field}/${json.value}`,
      });
    } catch (error: any) {
      console.log(error.message);
    }
  }
}

export {SortModel};
