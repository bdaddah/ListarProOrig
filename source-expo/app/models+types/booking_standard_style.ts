import {BookingStyleModel} from './booking_style';
import moment from 'moment';

class BookingStandardStyleModel extends BookingStyleModel {
  startTime?: number;
  startDate?: number;

  constructor(data: any) {
    super(data);
    this.style = 'standard';
    this.startTime = data.startTime;
    this.startDate = data.startDate;
  }

  get params() {
    return {
      ...super.params,
      booking_style: this.style,
      start_date: moment(this.startDate)?.format('YYYY-MM-DD'),
      start_time: moment(this.startTime)?.format('hh:mm'),
    };
  }

  validate(): string | undefined {
    const valid = super.validate();
    if (valid) {
      return valid;
    }
    if (!this.startTime) {
      return 'please_select_start_time';
    }
    if (!this.startDate) {
      return 'please_select_start_date';
    }
  }

  clone(): BookingStyleModel {
    return Object.assign(new BookingStandardStyleModel({}), this);
  }

  static fromJson(json: any): BookingStandardStyleModel | undefined {
    try {
      return new BookingStandardStyleModel({
        price: json.price ?? '',
        startTime: json.start_time ? Date.parse(json.start_time) : undefined,
        startDate: json.start_date ? Date.parse(json.start_date) : undefined,
      });
    } catch (e: any) {
      console.log(e.toString());
    }
  }
}

export {BookingStandardStyleModel};
