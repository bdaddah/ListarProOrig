import {BookingStyleModel} from './booking_style';
import moment from 'moment';

class BookingDailyStyleModel extends BookingStyleModel {
  startTime?: number;
  startDate?: number;
  endTime?: number;
  endDate?: number;

  constructor(data: any) {
    super(data);
    this.style = 'daily';
    this.startTime = data.startTime;
    this.startDate = data.startDate;
    this.endTime = data.endTime;
    this.endDate = data.endDate;
  }

  get params() {
    const params: {[key: string]: any} = {
      ...super.params,
      booking_style: this.style,
      start_date: moment(this.startDate)?.format('YYYY-MM-DD'),
      start_time: moment(this.startTime)?.format('hh:mm'),
    };
    if (this.endDate) {
      params.end_date = moment(this.endDate)?.format('YYYY-MM-DD');
    }
    if (this.endTime) {
      params.end_time = moment(this.endTime)?.format('hh:mm');
    }
    return params;
  }

  validate(): string | undefined {
    const valid = super.validate();
    if (valid) {
      return valid;
    }
    if (!this.startTime) {
      return 'choose_time_message';
    }
    if (!this.startDate) {
      return 'choose_date_message';
    }
  }

  clone(): BookingStyleModel {
    return Object.assign(new BookingDailyStyleModel({}), this);
  }

  static fromJson(json: any): BookingDailyStyleModel | undefined {
    try {
      return new BookingDailyStyleModel({
        price: json.price,
        startTime: json.start_time ? Date.parse(json.start_time) : undefined,
        startDate: json.start_date ? Date.parse(json.start_date) : undefined,
        endTime: json.end_time ? Date.parse(json.end_time) : undefined,
        endDate: json.end_date ? Date.parse(json.end_date) : undefined,
      });
    } catch (e: any) {
      console.log(e.toString());
    }
  }
}

export {BookingDailyStyleModel};
