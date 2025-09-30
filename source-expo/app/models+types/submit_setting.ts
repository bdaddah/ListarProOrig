import {CategoryModel} from '@models+types';

class SubmitSettingModel {
  categories: CategoryModel[];
  features: CategoryModel[];
  countries: CategoryModel[];
  states?: CategoryModel[];
  cities?: CategoryModel[];

  constructor(data: any) {
    this.categories = data.categories;
    this.features = data.features;
    this.countries = data.countries;
    this.states = data.states;
    this.cities = data.cities;
  }

  static fromJson(json: any): SubmitSettingModel | undefined {
    try {
      return new SubmitSettingModel({
        categories: (json.categories || []).map((e: any) =>
          CategoryModel.fromJson(e),
        ),
        features: (json.features || []).map((e: any) =>
          CategoryModel.fromJson(e),
        ),
        countries: (json.countries || []).map((e: any) =>
          CategoryModel.fromJson(e),
        ),
        states: (json.states || []).map((e: any) => CategoryModel.fromJson(e)),
        cities: (json.cities || []).map((e: any) => CategoryModel.fromJson(e)),
      });
    } catch (error: any) {
      console.log(error.message);
    }
  }
}

export {SubmitSettingModel};
