import {BookingStyleModel} from './booking_style';
import {ScheduleModel} from './schedule';
import moment from 'moment';

class BookingHourlyStyleModel extends BookingStyleModel {
  startDate?: number;
  schedule: ScheduleModel;
  scheduleOptions: ScheduleModel[];

  constructor(data: any) {
    super(data);
    this.style = 'hourly';
    this.startDate = data.startDate;
    this.schedule = data.schedule;
    this.scheduleOptions = data.scheduleOptions ?? [];
  }

  get params() {
    return {
      ...super.params,
      booking_style: this.style,
      start_date: moment(this.startDate)?.format('YYYY-MM-DD'),
      start_time: this.schedule?.start,
      end_time: this.schedule?.end,
    };
  }

  validate(): string | undefined {
    const valid = super.validate();
    if (valid) {
      return valid;
    }
    if (!this.schedule) {
      return 'please_select_schedule_time';
    }
    if (!this.startDate) {
      return 'please_select_start_date';
    }
  }

  clone(): BookingStyleModel {
    return Object.assign(new BookingHourlyStyleModel({}), this);
  }

  static fromJson(json: any): BookingHourlyStyleModel | undefined {
    try {
      return new BookingHourlyStyleModel({
        price: json.price,
        startDate: json.start_date ? Date.parse(json.start_date) : undefined,
        scheduleOptions: json.select_options?.map((item: any) => {
          return ScheduleModel.fromJson(item);
        }),
      });
    } catch (e: any) {
      console.log(e.toString());
    }
  }
}

export {BookingHourlyStyleModel};
