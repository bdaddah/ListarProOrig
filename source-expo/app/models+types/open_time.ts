import {ScheduleModel} from '@models+types';

class OpenTimeModel {
  dayOfWeek: number;
  key: string;
  schedule: ScheduleModel[];

  constructor(data: any) {
    this.dayOfWeek = data.dayOfWeek;
    this.key = data.key;
    this.schedule = data.schedule;
  }

  static fromJson(json: any): OpenTimeModel | undefined {
    try {
      return new OpenTimeModel({
        dayOfWeek: json.dayOfWeek ?? 1,
        key: json.key ?? 'mon',
        schedule: json.schedule?.map((e: any) => {
          return ScheduleModel.fromJson(e);
        }),
      });
    } catch (e: any) {
      console.log(e.toString());
    }
  }
}

export {OpenTimeModel};
